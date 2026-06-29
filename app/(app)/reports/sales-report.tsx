import CustomLineChart from '@/src/components/report/CustomLineChart'
import CustomPieChart from '@/src/components/report/CustomPieChart'
import MultiLineChart from '@/src/components/report/MultiLineChart'
import ReportCard from '@/src/components/report/ReportCard'
import { COLORS } from '@/src/constants/theme'
import { getSalesReportData, type SalesReportData } from '@/src/db/repositories/reportsRepository'
import { LegendPieChartType, ReportFilterType, TimePeriodType } from '@/src/types/appTypes'
import { calculateChartScale } from '@/src/Utility/calculateChartScale'
import { calculateMultiLineChartScale } from '@/src/Utility/calculateMultiLineChartScale'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'

const SalesReport = () => {

    const timePeriodFilterValues: TimePeriodType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const [salesOverviewTimePeriod, setSalesOverviewTimePeriod] = useState<TimePeriodType>('Monthly');
    const [reportData, setReportData] = useState<SalesReportData | null>(null);
    const [loading, setLoading] = useState(false);

    const [revenueProfitTimePeriod, setRevenueProfitTimePeriod] = useState<TimePeriodType>('Monthly');

    const loadReportData = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getSalesReportData(salesOverviewTimePeriod, revenueProfitTimePeriod);
            setReportData(data);
        } catch {
            Alert.alert('Load failed', 'Unable to load sales reports from local storage.');
        } finally {
            setLoading(false);
        }
    }, [revenueProfitTimePeriod, salesOverviewTimePeriod]);

    useFocusEffect(
        useCallback(() => {
            void loadReportData();
        }, [loadReportData])
    );

    const salesFilter: ReportFilterType = {
        value: salesOverviewTimePeriod,
        values: timePeriodFilterValues,
        onChange(val) {
            setSalesOverviewTimePeriod(val as TimePeriodType)
        }
    }

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

    const paymentStatusLabels: LegendPieChartType[] = reportData?.paymentStatusLabels ?? [
        { color: "bg-success", label: "Paid Dues", value: "145,000" },
        { color: "bg-warning", label: "Pending Dues", value: "42,000" },
        { color: "bg-danger", label: "Unpaid Dues", value: "18,000" }
    ]
    const monthlySalesData = reportData?.salesOverviewData ?? [];
    const duesPieData = reportData?.paymentStatusPieData ?? [];
    const revenueData = reportData?.revenueData ?? [];
    const profitData = reportData?.profitData ?? [];

    return (
        <View>
            {loading && !reportData && <ActivityIndicator className='my-8' />}

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
