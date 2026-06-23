import CustomBarChart from '@/src/components/report/CustomBarChart'
import CustomPieChart from '@/src/components/report/CustomPieChart'
import MultiLineChart from '@/src/components/report/MultiLineChart'
import ReportCard from '@/src/components/report/ReportCard'
import { addedStockData, duesPieData, productCategoryBarData, soldStockData } from '@/src/constants/giftedChart'
import { COLORS } from '@/src/constants/theme'
import { calculateChartScale } from '@/src/lib/calculateChartScale'
import { LegendPieChartType, ProductRankingType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import React, { useState } from 'react'
import { View } from 'react-native'

const StockReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const rankFilterValues: ProductRankingType[] = ['Top 5', 'Top 10', 'Bottom 5', 'Bottom 10'];

    const [stockOverviewTimePeriod, setStockOverviewTimePeriod] = useState<TimePeriodType>('Monthly');

    const stockOverviewFilter: ReportFilterType = {
        value: stockOverviewTimePeriod,
        values: timePeriodFilterValues,
        onChange(val) {
            setStockOverviewTimePeriod(val as TimePeriodType)
        }
    }

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

    const [productOverviewRank, setProductOverviewRank] = useState<ProductRankingType>('Top 5');

    const productOverviewRankFilter: ReportFilterType = {
        value: productOverviewRank,
        values: rankFilterValues,
        onChange(val) {
            setProductOverviewRank(val as ProductRankingType)
        }
    }

    const stockStatusLabels: LegendPieChartType[] = [
        { color: "bg-success", label: "In Stock", value: "145" },
        { color: "bg-warning", label: "Low Stock", value: "42" },
        { color: "bg-danger", label: "Out of Stock", value: "18" }
    ]

    return (
        <View>
            {/* Stock Overview */}
            <ReportCard title="STOCK OVERVIEW" hasFilter={stockOverviewFilter}>
                <MultiLineChart
                    firstLineData={addedStockData}
                    secondLineData={soldStockData}
                    legendData={stockOverviewLabels}
                />
            </ReportCard>

            {/* Stock Status */}
            <ReportCard title="STOCK STATUS">
                <CustomPieChart data={duesPieData} radius={90} legendLabelData={stockStatusLabels} />
            </ReportCard>

            {/* Product Overview */}
            <ReportCard title="PRODUCT OVERVIEW" hasFilter={productOverviewRankFilter}>
                <CustomBarChart
                    data={productCategoryBarData}
                    chartScale={calculateChartScale(productCategoryBarData, 10)}
                />
            </ReportCard>
        </View>
    )
}

export default StockReport