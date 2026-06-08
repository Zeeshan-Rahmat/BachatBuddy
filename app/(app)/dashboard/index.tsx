// app/(app)/dashboard/index.tsx
import { ScreenWrapper } from '@components/layout/ScreenWrapper';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
    return (
        <ScreenWrapper>

            {/* Stat Cards 2x2 */}
            <View className="flex-row flex-wrap px-3 pt-4 gap-3">
                <StatCard icon="💳" trend="+10%" trendUp value="120" label="Total Stock" />
                <StatCard icon="📋" trend="+5%" trendUp value="40" label="Total Sales" />
                <StatCard icon="👤" trend="-4%" trendUp={false} value="25" label="Active Customers" />
                <StatCard icon="💰" trend="-8%" trendUp value="12,000" label="Remaining Loans" />
            </View>

            {/* Quick Action */}
            <SectionHeader title="QUICK ACTION" />
            <View className="flex-row px-3 gap-3">
                <QuickActionCard icon="🧾" label="New Sale" />
                <QuickActionCard icon="📦" label="New Stock" />
                <QuickActionCard icon="📒" label="Ledger" />
                <QuickActionCard icon="🖨️" label="Invoice" />
            </View>

            {/* Quick Report */}
            <SectionHeader title="QUICK REPORT" />
            <View className="flex-row flex-wrap px-3 gap-3">
                <QuickActionCard icon="⬇️" label="Low Stock" />
                <QuickActionCard icon="📦" label="Total Stock" />
                <QuickActionCard icon="💸" label="Pending Dues" />
                <QuickActionCard icon="📊" label="Profit & Loss" />
                <QuickActionCard icon="↔️" label="Total Sales" />
                <QuickActionCard icon="🗂️" label="Top Products" />
                <QuickActionCard icon="📋" label="Invoices Sum" />
                <QuickActionCard icon="📒" label="Ledger Sum" />
            </View>

        </ScreenWrapper>
    );
}

function StatCard({ icon, trend, trendUp, value, label }: {
    icon: string; trend: string; trendUp: boolean; value: string; label: string;
}) {
    return (
        <View className="bg-white rounded-2xl p-4 flex-1 min-w-[44%]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 }}>
            <View className="flex-row items-center justify-between mb-3">
                <View className="w-11 h-11 rounded-full bg-slate-200 items-center justify-center">
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                </View>
                <View className={`flex-row items-center px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    <Text className={`text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {trendUp ? '▲' : '▼'} {trend}
                    </Text>
                </View>
            </View>
            <Text className="text-3xl font-bold text-slate-900 mb-1">{value}</Text>
            <View className="flex-row items-center justify-between">
                <Text className="text-slate-500 text-sm">{label}</Text>
                <Text className="text-slate-400 text-base">↗</Text>
            </View>
        </View>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <View className="flex-row items-center justify-between px-4 mt-6 mb-3">
            <Text className="text-slate-800 text-base font-bold tracking-wide">{title}</Text>
            <TouchableOpacity><Text className="text-slate-400 text-sm">View All</Text></TouchableOpacity>
        </View>
    );
}

function QuickActionCard({ icon, label }: { icon: string; label: string }) {
    return (
        <TouchableOpacity className="bg-white rounded-2xl items-center justify-center py-4 flex-1 min-w-[22%]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
            <View className="w-12 h-12 rounded-full bg-slate-200 items-center justify-center mb-2">
                <Text style={{ fontSize: 22 }}>{icon}</Text>
            </View>
            <Text className="text-slate-700 text-xs text-center font-medium">{label}</Text>
        </TouchableOpacity>
    );
}