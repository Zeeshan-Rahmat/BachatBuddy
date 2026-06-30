import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import QuickCard from '@components/dashboard/QuickCard';
import SectionHeader from '@components/dashboard/SectionHeader';
import StatCard from '@components/dashboard/StatCard';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import { ICONS } from '@constants/icons';
import { ROUTES } from '@constants/routes';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import {
    dashboardRepository,
    type DashboardSummaryData,
    type DashboardStat,
} from '@/src/db/repositories/dashboardRepository';

const formatNumber = (value: number): string => {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
    }

    return String(Math.round(value));
};

const formatTrend = (stat: DashboardStat): string => {
    const prefix = stat.trendPercent > 0 ? '+' : '';

    return `${prefix}${stat.trendPercent}%`;
};

export default function DashboardScreen() {
    const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            setIsLoading(true);
            setLoadError(null);

            dashboardRepository
                .getDashboardSummaryData()
                .then((data) => {
                    if (isActive) {
                        setSummary(data);
                    }
                })
                .catch((error: unknown) => {
                    console.error('Failed to load dashboard summary from SQLite', error);
                    if (isActive) {
                        setLoadError('Unable to load local dashboard data.');
                    }
                })
                .finally(() => {
                    if (isActive) {
                        setIsLoading(false);
                    }
                });

            return () => {
                isActive = false;
            };
        }, []),
    );

    return (
        <ScreenWrapper>
            <PaddingWrapper>
                {isLoading && !summary ? (
                    <View className="items-center justify-center py-12">
                        <ActivityIndicator color="#10b981" />
                    </View>
                ) : null}

                {loadError ? (
                    <View className="rounded-button bg-rose-100 p-4">
                        <Text className="text-center font-semibold text-rose-600">{loadError}</Text>
                    </View>
                ) : null}

                {/* Stat Cards */}
                {summary ? (
                    <View className="flex-row flex-wrap gap-3">
                        <StatCard
                            icon={ICONS.DASHBOARD.totalProducts}
                            trend={formatTrend(summary.totalStock)}
                            trendUp={summary.totalStock.trendUp}
                            value={formatNumber(summary.totalStock.value)}
                            label="Total Stock"
                        />
                        <StatCard
                            icon={ICONS.DASHBOARD.totalCardSales}
                            trend={formatTrend(summary.totalSales)}
                            trendUp={summary.totalSales.trendUp}
                            value={formatNumber(summary.totalSales.value)}
                            valuePrefix="PKR"
                            label="Total Sales"
                        />
                        <StatCard
                            icon={ICONS.DASHBOARD.usersActive}
                            trend={formatTrend(summary.activeCustomers)}
                            trendUp={summary.activeCustomers.trendUp}
                            value={formatNumber(summary.activeCustomers.value)}
                            label="Active Customers"
                        />
                        <StatCard
                            icon={ICONS.DASHBOARD.loans}
                            trend={formatTrend(summary.remainingLoans)}
                            trendUp={summary.remainingLoans.trendUp}
                            value={formatNumber(summary.remainingLoans.value)}
                            valuePrefix="PKR"
                            label="Remaining Loans"
                        />
                    </View>
                ) : null}

                {/* Quick Action */}
                <SectionHeader title="QUICK ACTION" />
                <View className="flex-row gap-3">
                    <QuickCard icon={ICONS.DASHBOARD.newSale} label="New Sale" onPress={() => router.push(ROUTES.SALE.ADD_INVOICE)} />
                    <QuickCard icon={ICONS.DASHBOARD.addProduct} label="New Stock" onPress={() => router.push(ROUTES.STOCK)} />
                    <QuickCard icon={ICONS.DASHBOARD.ledger} label="Ledger" onPress={() => router.push(ROUTES.PARTIES)} />
                    <QuickCard icon={ICONS.DASHBOARD.invoice} label="Invoice" onPress={() => router.push(ROUTES.SALE.INDEX)} />
                </View>

                {/* Quick Report */}
                <SectionHeader title="QUICK REPORT" />
                <View className="flex-row flex-wrap gap-3">
                    <QuickCard icon={ICONS.DASHBOARD.lowStock} label="Low Stock" onPress={() => router.push(ROUTES.STOCK)} />
                    <QuickCard icon={ICONS.DASHBOARD.totalStock} label="Total Stock" onPress={() => router.push(ROUTES.STOCK)} />
                    <QuickCard icon={ICONS.DASHBOARD.pendingDues} label="Pending Dues" onPress={() => router.push(ROUTES.PARTIES)} />
                    <QuickCard icon={ICONS.DASHBOARD.profitLoss} label="Profit & Loss" onPress={() => router.push(ROUTES.REPORTS)} />
                </View>
                <View className="flex-row flex-wrap gap-3 mt-4">
                    <QuickCard icon={ICONS.DASHBOARD.totalSales} label="Total Sales" onPress={() => router.push(ROUTES.REPORTS)} />
                    <QuickCard icon={ICONS.DASHBOARD.topProducts} label="Top Products" onPress={() => router.push(ROUTES.REPORTS)} />
                    <QuickCard icon={ICONS.DASHBOARD.invoiceSum} label="Invoices" onPress={() => router.push(ROUTES.SALE.INDEX)} />
                    <QuickCard icon={ICONS.DASHBOARD.ledgerSum} label="Ledger" onPress={() => router.push(ROUTES.PARTIES)} />
                </View>

            </PaddingWrapper>
        </ScreenWrapper>
    );
}
