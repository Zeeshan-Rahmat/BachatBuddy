import CustomLineChart from '@/src/components/report/CustomLineChart'
import LegendItem from '@/src/components/report/LegendItem'
import ReportCard from '@/src/components/report/ReportCard'
import { duesPieData, monthlySalesData, profitData, revenueData } from '@/src/constants/giftedChart'
import { ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import React, { useState } from 'react'
import { View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'

const SalesReport = () => {

    const filterOptions: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const [salesOverviewTimePeriod, setSalesOverviewTimePeriod] = useState<TimePeriodType>('Monthly');

    const salesFilter: ReportFilterType = {
        value: salesOverviewTimePeriod,
        values: filterOptions,
        onChange(val) {
            setSalesOverviewTimePeriod(val as TimePeriodType)
        }
    }

    const [revenueProfitTimePeriod, setRevenueProfitTimePeriod] = useState<TimePeriodType>('Monthly');

    const revenueProfitFilter: ReportFilterType = {
        value: revenueProfitTimePeriod,
        values: filterOptions,
        onChange(val) {
            setRevenueProfitTimePeriod(val as TimePeriodType)
        }
    }

    return (
        <View>
            {/* Sales Overview */}
            <ReportCard title="SALES OVERVIEW" hasFilter={salesFilter}>
                <View className="rounded-button items-center justify-center overflow-hidden">
                    <CustomLineChart firstLine={monthlySalesData} />
                </View>
            </ReportCard>

            {/* Payment Status */}
            <ReportCard title="PAYMENT STATUS">
                <View className="flex-row items-center">
                    <View className="flex-1">
                        <LegendItem color="bg-success" label="Paid Dues" value="145,000" />
                        <LegendItem color="bg-warning" label="Pending Dues" value="42,000" />
                        <LegendItem color="bg-danger" label="Unpaid Dues" value="18,000" />
                    </View>
                    <PieChart data={duesPieData} radius={80} />
                </View>
            </ReportCard>

            {/* Revenue vs Profit */}
            <ReportCard title="REVENUE VS PROFIT" hasFilter={revenueProfitFilter}>
                <View className="rounded-button items-center justify-center overflow-hidden">
                    <CustomLineChart firstLine={revenueData} secondLine={profitData} />
                </View>
            </ReportCard>
        </View>
    )
}

export default SalesReport