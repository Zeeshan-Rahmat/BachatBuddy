import CustomBarChart from '@/src/components/report/CustomBarChart'
import CustomLineChart from '@/src/components/report/CustomLineChart'
import RankItemCard from '@/src/components/report/RankItemCard'
import ReportCard from '@/src/components/report/ReportCard'
import { newCustomersData } from '@/src/constants/giftedChart'
import { ICONS } from '@/src/constants/icons'
import { COLORS } from '@/src/constants/theme'
import { mockCustomers, mockSuppliers } from '@/src/lib/sampleData'
import { ProductRankingType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import { calculateChartScale } from '@/src/Utility/calculateChartScale'
import { convertCustomersToGroupedBarData } from '@/src/Utility/convertCustomersToGroupedBarData'
import { convertSuppliersToBarChartData } from '@/src/Utility/convertSuppliersToBarChartData'
import { getTopBottomParties } from '@/src/Utility/getTopBottomParties'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

const PartyReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const rankFilterValues: ProductRankingType[] = ['Top 5', 'Top 10', 'Bottom 5', 'Bottom 10'];

    const [customerGrowthTimePeriod, setCustomerGrowthTimePeriod] = useState<TimePeriodType>('Monthly');
    const [customerOverviewRank, setCustomerOverviewRank] = useState<ProductRankingType>('Top 5');
    const [supplierOverviewRank, setSupplierOverviewRank] = useState<ProductRankingType>('Top 5');

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


    {/* Customer Overview Data */ }
    const rankedCustomers = useMemo(() => {
        return getTopBottomParties({
            parties: mockCustomers,
            type: customerOverviewRank.split(' ')[0] === "Top" ? 'top' : 'bottom',
            limit: customerOverviewRank.split(' ')[1] === "5" ? 5 : 10,
            metric: 'total_purchases',
        });

    }, [mockCustomers, customerOverviewRank]);

    const customersGroupedBarChartData = useMemo(() => {
        return convertCustomersToGroupedBarData({
            customers: rankedCustomers,
            spendingColor: COLORS.primaryGreen,
            duesColor: COLORS.warning,
        });

    }, [rankedCustomers]);


    {/* Customer Overview Data */ }
    const rankedSuppliers = useMemo(() => {
        return getTopBottomParties({
            parties: mockSuppliers,
            type: customerOverviewRank.split(' ')[0] === "Top" ? 'top' : 'bottom',
            limit: customerOverviewRank.split(' ')[1] === "5" ? 5 : 10,
            metric: 'total_supply_value',
        });

    }, [mockSuppliers, supplierOverviewRank]);

    const suppliersGroupedBarChartData = useMemo(() => {
        return convertSuppliersToBarChartData({
            suppliers: rankedSuppliers,
            barColor: COLORS.primaryGreen,
        });

    }, [rankedSuppliers]);

    return (
        <View>
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
                    rankedCustomers &&
                    rankedCustomers.map((item) => {
                        return (
                            <RankItemCard
                                key={item.customer_id}
                                item={item}
                                placeholder={ICONS.COMMON.customer}
                                isCustomer
                            />
                        )
                    })
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
                    rankedSuppliers &&
                    rankedSuppliers.map((item) => {
                        return (
                            <RankItemCard
                                key={item.supplier_id}
                                item={item}
                                placeholder={ICONS.COMMON.customer}
                                isSupplier
                            />
                        )
                    })
                }
            </View>

        </View>
    )
}

export default PartyReport