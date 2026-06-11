import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import QuickCard from '@components/dashboard/QuickCard';
import SectionHeader from '@components/dashboard/SectionHeader';
import StatCard from '@components/dashboard/StatCard';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import { ICONS } from '@constants/icons';
import React from 'react';
import { View } from 'react-native';

export default function DashboardScreen() {
    return (
        <ScreenWrapper>
            <PaddingWrapper>

                {/* Stat Cards 2x2 */}
                <View className="flex-row flex-wrap gap-3">
                    <StatCard icon={ICONS.DASHBOARD.totalProducts} trend="+10%" trendUp value="120" label="Total Stock" />
                    <StatCard icon={ICONS.DASHBOARD.totalCardSales} trend="+5%" trendUp value="40" label="Total Sales" />
                    <StatCard icon={ICONS.DASHBOARD.usersActive} trend="-4%" trendUp={false} value="25" label="Active Customers" />
                    <StatCard icon={ICONS.DASHBOARD.loans} trend="-8%" trendUp value="12,000" label="Remaining Loans" />
                </View>

                {/* Quick Action */}
                <SectionHeader title="QUICK ACTION" />
                <View className="flex-row gap-3">
                    <QuickCard icon={ICONS.DASHBOARD.newSale} label="New Sale" />
                    <QuickCard icon={ICONS.DASHBOARD.addProduct} label="New Stock" />
                    <QuickCard icon={ICONS.DASHBOARD.ledger} label="Ledger" />
                    <QuickCard icon={ICONS.DASHBOARD.invoice} label="Invoice" />
                </View>

                {/* Quick Report */}
                <SectionHeader title="QUICK REPORT" />
                <View className="flex-row flex-wrap gap-3">
                    <QuickCard icon={ICONS.DASHBOARD.lowStock} label="Low Stock" />
                    <QuickCard icon={ICONS.DASHBOARD.totalStock} label="Total Stock" />
                    <QuickCard icon={ICONS.DASHBOARD.pendingDues} label="Pending Dues" />
                    <QuickCard icon={ICONS.DASHBOARD.profitLoss} label="Profit & Loss" />
                </View>
                <View className="flex-row flex-wrap gap-3 mt-4">
                    <QuickCard icon={ICONS.DASHBOARD.totalSales} label="Total Sales" />
                    <QuickCard icon={ICONS.DASHBOARD.topProducts} label="Top Products" />
                    <QuickCard icon={ICONS.DASHBOARD.invoiceSum} label="Invoices Sum" />
                    <QuickCard icon={ICONS.DASHBOARD.ledgerSum} label="Ledger Sum" />
                </View>

            </PaddingWrapper>
        </ScreenWrapper>
    );
}