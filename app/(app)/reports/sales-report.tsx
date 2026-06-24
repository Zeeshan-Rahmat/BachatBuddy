import CustomLineChart from '@/src/components/report/CustomLineChart'
import CustomPieChart from '@/src/components/report/CustomPieChart'
import MultiLineChart from '@/src/components/report/MultiLineChart'
import ReportCard from '@/src/components/report/ReportCard'
import { duesPieData, monthlySalesData, profitData, revenueData } from '@/src/constants/giftedChart'
import { COLORS } from '@/src/constants/theme'
import { LegendPieChartType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import { calculateChartScale } from '@/src/Utility/calculateChartScale'
import { calculateMultiLineChartScale } from '@/src/Utility/calculateMultiLineChartScale'
import React, { useState } from 'react'
import { View } from 'react-native'

const SalesReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const [salesOverviewTimePeriod, setSalesOverviewTimePeriod] = useState<TimePeriodType>('Monthly');

    const salesFilter: ReportFilterType = {
        value: salesOverviewTimePeriod,
        values: timePeriodFilterValues,
        onChange(val) {
            setSalesOverviewTimePeriod(val as TimePeriodType)
        }
    }

    const [revenueProfitTimePeriod, setRevenueProfitTimePeriod] = useState<TimePeriodType>('Monthly');

    const revenueProfitFilter: ReportFilterType = {
        value: revenueProfitTimePeriod,
        values: timePeriodFilterValues,
        onChange(val) {
            setRevenueProfitTimePeriod(val as TimePeriodType)
        }
    }

    const revenueProfitLabels = [
        {
            label: "Revenue",
            color: COLORS.primaryGreen,
            dotColor: COLORS.darkGreen,
        },
        {
            label: "Profit",
            color: COLORS.navy300,
            dotColor: COLORS.primaryNavy,
        },
    ];

    const paymentStatusLabels: LegendPieChartType[] = [
        { color: "bg-success", label: "Paid Dues", value: "145,000" },
        { color: "bg-warning", label: "Pending Dues", value: "42,000" },
        { color: "bg-danger", label: "Unpaid Dues", value: "18,000" }
    ]

    return (
        <View>
            {/* Sales Overview */}
            <ReportCard title="SALES OVERVIEW" hasFilter={salesFilter}>
                <CustomLineChart firstLineData={monthlySalesData} chartScale={calculateChartScale(monthlySalesData, 10)} />
            </ReportCard>

            {/* Payment Status */}
            <ReportCard title="PAYMENT STATUS">
                <CustomPieChart data={duesPieData} radius={90} legendLabelData={paymentStatusLabels} />
            </ReportCard>

            {/* Revenue vs Profit */}
            <ReportCard title="REVENUE VS PROFIT" hasFilter={revenueProfitFilter}>
                <MultiLineChart
                    firstLineData={revenueData}
                    secondLineData={profitData}
                    legendData={revenueProfitLabels}
                    chartScale={calculateMultiLineChartScale([revenueData, profitData], 10)}
                />
            </ReportCard>
        </View>
    )
}

export default SalesReport