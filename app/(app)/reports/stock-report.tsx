import CustomBarChart from '@/src/components/report/CustomBarChart'
import CustomPieChart from '@/src/components/report/CustomPieChart'
import MultiLineChart from '@/src/components/report/MultiLineChart'
import RankItemCard from '@/src/components/report/RankItemCard'
import ReportCard from '@/src/components/report/ReportCard'
import { ICONS } from '@/src/constants/icons'
import { COLORS } from '@/src/constants/theme'
import { getStockReportData, type StockReportData } from '@/src/db/repositories/reportsRepository'
import { LegendPieChartType, ProductRankingType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import { calculateChartScale } from '@/src/Utility/calculateChartScale'
import { calculateMultiLineChartScale } from '@/src/Utility/calculateMultiLineChartScale'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Text, View } from 'react-native'

const StockReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const rankFilterValues: ProductRankingType[] = ['Top 5', 'Top 10', 'Bottom 5', 'Bottom 10'];

    const [stockOverviewTimePeriod, setStockOverviewTimePeriod] = useState<TimePeriodType>('Monthly');
    const [productOverviewRank, setProductOverviewRank] = useState<ProductRankingType>('Top 5');
    const [reportData, setReportData] = useState<StockReportData | null>(null);
    const [loading, setLoading] = useState(false);

    const loadReportData = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getStockReportData(stockOverviewTimePeriod, productOverviewRank);
            setReportData(data);
        } catch {
            Alert.alert('Load failed', 'Unable to load stock reports from local storage.');
        } finally {
            setLoading(false);
        }
    }, [productOverviewRank, stockOverviewTimePeriod]);

    useFocusEffect(
        useCallback(() => {
            void loadReportData();
        }, [loadReportData])
    );

    const stockOverviewFilter: ReportFilterType = {
        value: stockOverviewTimePeriod,
        values: timePeriodFilterValues,
        onChange(val) {
            setStockOverviewTimePeriod(val as TimePeriodType)
        }
    }

    const productOverviewRankFilter: ReportFilterType = {
        value: productOverviewRank,
        values: rankFilterValues,
        onChange(val) {
            setProductOverviewRank(val as ProductRankingType)
        }
    }


    {/* Stock Overview Labels */ }
    const stockOverviewLabels = [
        {
            label: "Added Stock",
            color: COLORS.primaryGreen,
            dotColor: COLORS.darkGreen,
        },
        {
            label: "Soled Stock",
            color: COLORS.navy300,
            dotColor: COLORS.primaryNavy,
        },
    ];


    {/* Stock Status Labels */ }
    const stockStatusLabels: LegendPieChartType[] = reportData?.stockStatusLabels ?? [
        { color: "bg-success", label: "In Stock", value: "145" },
        { color: "bg-warning", label: "Low Stock", value: "42" },
        { color: "bg-danger", label: "Out of Stock", value: "18" }
    ]

    const addedStockData = reportData?.addedStockData ?? [];
    const soldStockData = reportData?.soldStockData ?? [];
    const stockStatusDonutData = reportData?.stockStatusPieData ?? [];
    const rankedProducts = reportData?.rankedProducts ?? [];
    const productsChartData = reportData?.productsChartData ?? [];

    return (
        <View>
            {loading && !reportData && <ActivityIndicator className='my-8' />}

            {/* Stock Overview */}
            <ReportCard title="STOCK OVERVIEW" hasFilter={stockOverviewFilter}>
                <MultiLineChart
                    firstLineData={addedStockData}
                    secondLineData={soldStockData}
                    legendData={stockOverviewLabels}
                    chartScale={calculateMultiLineChartScale([addedStockData, soldStockData], 10)}
                />
            </ReportCard>

            {/* Stock Status */}
            <ReportCard title="STOCK STATUS">
                <CustomPieChart data={stockStatusDonutData} radius={90} legendLabelData={stockStatusLabels} />
            </ReportCard>

            {/* Product Overview */}
            <ReportCard title="PRODUCT OVERVIEW" hasFilter={productOverviewRankFilter}>
                <CustomBarChart
                    data={productsChartData}
                    chartScale={calculateChartScale(productsChartData, 10)}
                />
            </ReportCard>

            <View>
                {
                    rankedProducts.length > 0 ?
                    rankedProducts.map((item) => {
                        return (
                            <RankItemCard
                                key={item.product_id}
                                item={item}
                                placeholder={ICONS.COMMON.product}
                                isProduct
                            />
                        )
                    }) :
                        <Text className='text-center text-dark-50 mb-4'>No product report data found</Text>
                }
            </View>
        </View>
    )
}

export default StockReport
