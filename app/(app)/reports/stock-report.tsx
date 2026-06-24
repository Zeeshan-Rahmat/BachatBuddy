import CustomBarChart from '@/src/components/report/CustomBarChart'
import CustomPieChart from '@/src/components/report/CustomPieChart'
import MultiLineChart from '@/src/components/report/MultiLineChart'
import RankItemCard from '@/src/components/report/RankItemCard'
import ReportCard from '@/src/components/report/ReportCard'
import { addedStockData, soldStockData, stockStatusDonutData } from '@/src/constants/giftedChart'
import { ICONS } from '@/src/constants/icons'
import { COLORS } from '@/src/constants/theme'
import { mockProducts } from '@/src/lib/sampleData'
import { LegendPieChartType, ProductRankingType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import { calculateChartScale } from '@/src/Utility/calculateChartScale'
import { convertProductsToBarChartData } from '@/src/Utility/convertProductsToBarChartData'
import { getTopBottomProducts } from '@/src/Utility/getTopBottomProducts'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

const StockReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const rankFilterValues: ProductRankingType[] = ['Top 5', 'Top 10', 'Bottom 5', 'Bottom 10'];

    const [stockOverviewTimePeriod, setStockOverviewTimePeriod] = useState<TimePeriodType>('Monthly');
    const [productOverviewRank, setProductOverviewRank] = useState<ProductRankingType>('Top 5');

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
    const stockStatusLabels: LegendPieChartType[] = [
        { color: "bg-success", label: "In Stock", value: "145" },
        { color: "bg-warning", label: "Low Stock", value: "42" },
        { color: "bg-danger", label: "Out of Stock", value: "18" }
    ]


    {/* Product Overview Data */ }
    const rankedProducts = useMemo(() => {
        return getTopBottomProducts({
            products: mockProducts,
            type: productOverviewRank.split(' ')[0] === "Top" ? 'top' : 'bottom',
            limit: productOverviewRank.split(' ')[1] === "5" ? 5 : 10,
        });

    }, [mockProducts, productOverviewRank]);

    const productsChartData = useMemo(() => {
        return convertProductsToBarChartData({
            products: rankedProducts,
            metric: 'sold_stock',
            barColor: COLORS.primaryGreen
        });

    }, [rankedProducts]);

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
                    rankedProducts &&
                    rankedProducts.map((item) => {
                        return (
                            <RankItemCard
                                key={item.product_id}
                                item={item}
                                placeholder={ICONS.COMMON.product}
                                isProduct
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

export default StockReport