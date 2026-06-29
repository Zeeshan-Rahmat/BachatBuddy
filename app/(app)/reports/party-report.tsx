import CustomBarChart from '@/src/components/report/CustomBarChart'
import CustomLineChart from '@/src/components/report/CustomLineChart'
import RankItemCard from '@/src/components/report/RankItemCard'
import ReportCard from '@/src/components/report/ReportCard'
import { ICONS } from '@/src/constants/icons'
import { getPartyReportData, type PartyReportData } from '@/src/db/repositories/reportsRepository'
import { ProductRankingType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import { calculateChartScale } from '@/src/Utility/calculateChartScale'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Text, View } from 'react-native'

const PartyReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const rankFilterValues: ProductRankingType[] = ['Top 5', 'Top 10', 'Bottom 5', 'Bottom 10'];

    const [customerGrowthTimePeriod, setCustomerGrowthTimePeriod] = useState<TimePeriodType>('Monthly');
    const [customerOverviewRank, setCustomerOverviewRank] = useState<ProductRankingType>('Top 5');
    const [supplierOverviewRank, setSupplierOverviewRank] = useState<ProductRankingType>('Top 5');
    const [reportData, setReportData] = useState<PartyReportData | null>(null);
    const [loading, setLoading] = useState(false);

    const loadReportData = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getPartyReportData(customerGrowthTimePeriod, customerOverviewRank, supplierOverviewRank);
            setReportData(data);
        } catch {
            Alert.alert('Load failed', 'Unable to load party reports from local storage.');
        } finally {
            setLoading(false);
        }
    }, [customerGrowthTimePeriod, customerOverviewRank, supplierOverviewRank]);

    useFocusEffect(
        useCallback(() => {
            void loadReportData();
        }, [loadReportData])
    );

    const salesFilter: ReportFilterType = {
        value: customerGrowthTimePeriod,
        values: timePeriodFilterValues,
        onChange(val) {
            setCustomerGrowthTimePeriod(val as TimePeriodType)
        }
    }


    const customerOverviewRankFilter: ReportFilterType = {
        value: customerOverviewRank,
        values: rankFilterValues,
        onChange(val) {
            setCustomerOverviewRank(val as ProductRankingType)
        }
    }

    const supplierOverviewRankFilter: ReportFilterType = {
        value: supplierOverviewRank,
        values: rankFilterValues,
        onChange(val) {
            setSupplierOverviewRank(val as ProductRankingType)
        }
    }


    const newCustomersData = reportData?.customerGrowthData ?? [];
    const rankedCustomers = reportData?.rankedCustomers ?? [];
    const customersGroupedBarChartData = reportData?.customersChartData ?? [];
    const rankedSuppliers = reportData?.rankedSuppliers ?? [];
    const suppliersGroupedBarChartData = reportData?.suppliersChartData ?? [];

    return (
        <View>
            {loading && !reportData && <ActivityIndicator className='my-8' />}

            {/* Customer Growth */}
            <ReportCard title="CUSTOMER GROWTH" hasFilter={salesFilter}>
                <CustomLineChart firstLineData={newCustomersData} chartScale={calculateChartScale(newCustomersData, 5)} />
            </ReportCard>

            {/* Customer Overview */}
            <ReportCard title="CUSTOMER OVERVIEW" hasFilter={customerOverviewRankFilter}>
                <CustomBarChart
                    data={customersGroupedBarChartData}
                    chartScale={calculateChartScale(customersGroupedBarChartData, 8)}
                />
            </ReportCard>

            <View className='mb-2'>
                {
                    rankedCustomers.length > 0 ?
                    rankedCustomers.map((item) => {
                        return (
                            <RankItemCard
                                key={item.customer_id}
                                item={item}
                                placeholder={ICONS.COMMON.customer}
                                isCustomer
                            />
                        )
                    }) :
                        <Text className='text-center text-dark-50 mb-4'>No customer report data found</Text>
                }
            </View>

            {/* Supplier Overview */}
            <ReportCard title="SUPPLIER OVERVIEW" hasFilter={supplierOverviewRankFilter}>
                <CustomBarChart
                    data={suppliersGroupedBarChartData}
                    chartScale={calculateChartScale(suppliersGroupedBarChartData, 8)}
                />
            </ReportCard>

            <View>
                {
                    rankedSuppliers.length > 0 ?
                    rankedSuppliers.map((item) => {
                        return (
                            <RankItemCard
                                key={item.supplier_id}
                                item={item}
                                placeholder={ICONS.COMMON.customer}
                                isSupplier
                            />
                        )
                    }) :
                        <Text className='text-center text-dark-50 mb-4'>No supplier report data found</Text>
                }
            </View>

        </View>
    )
}

export default PartyReport
