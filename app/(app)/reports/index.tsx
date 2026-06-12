// app/(app)/reports/index.tsx
import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const TABS = ['Sales', 'Stock', 'Parties'];

export default function ReportsScreen() {
    const [activeTab, setActiveTab] = useState('Sales');

    return (
        <ScreenWrapper scrollable={false}>

            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >

                    {activeTab === 'Sales' && <SalesReport />}
                    {activeTab === 'Stock' && <PlaceholderReport title="Stock Reports" />}
                    {activeTab === 'Parties' && <PlaceholderReport title="Parties Reports" />}

                </ScrollView>
            </PaddingWrapper>

        </ScreenWrapper>
    );
}

function SalesReport() {
    return (
        <View>
            {/* Sales Overview */}
            <ReportCard title="SALES OVERVIEW" filter="Monthly">
                <View className="h-44 bg-slate-50 rounded-xl items-center justify-center border border-slate-100">
                    <Text className="text-slate-400 text-sm">📈 Line chart goes here</Text>
                    <Text className="text-slate-300 text-xs mt-1">Install: react-native-gifted-charts</Text>
                </View>
            </ReportCard>

            {/* Payment Status */}
            <ReportCard title="PAYMENT STATUS">
                <View className="flex-row items-center">
                    <View className="flex-1">
                        <LegendItem color="bg-emerald-500" label="Paid Dues" value="145,000" />
                        <LegendItem color="bg-amber-400" label="Pending Dues" value="42,000" />
                        <LegendItem color="bg-rose-500" label="Unpaid Dues" value="18,000" />
                    </View>
                    <View className="w-32 h-32 rounded-full bg-slate-100 items-center justify-center">
                        <Text className="text-slate-400 text-xs text-center">🥧{'\n'}Pie chart</Text>
                    </View>
                </View>
            </ReportCard>

            {/* Revenue vs Profit */}
            <ReportCard title="REVENUE VS PROFIT" filter="Monthly">
                <View className="h-44 bg-slate-50 rounded-xl items-center justify-center border border-slate-100">
                    <Text className="text-slate-400 text-sm">📈 Dual line chart goes here</Text>
                </View>
            </ReportCard>
        </View>
    );
}

function ReportCard({ title, filter, children }: {
    title: string; filter?: string; children: React.ReactNode;
}) {
    return (
        <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-slate-500 text-xs font-bold tracking-widest">{title}</Text>
                {filter && (
                    <TouchableOpacity className="flex-row items-center border border-slate-200 rounded-lg px-2 py-1">
                        <Text className="text-slate-600 text-xs mr-1">{filter}</Text>
                        <Text className="text-slate-400 text-xs">▼</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View className="bg-white rounded-2xl p-4"
                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                {children}
            </View>
        </View>
    );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
    return (
        <View className="flex-row items-center mb-3">
            <View className={`w-3 h-3 rounded-full ${color} mr-2`} />
            <View>
                <Text className="text-slate-500 text-xs">{label}</Text>
                <Text className="text-slate-800 font-bold text-sm">{value}</Text>
            </View>
        </View>
    );
}

function PlaceholderReport({ title }: { title: string }) {
    return (
        <View className="flex-1 items-center justify-center px-8 pt-20">
            <Text style={{ fontSize: 48 }}>📊</Text>
            <Text className="text-slate-700 font-bold text-lg mt-4">{title}</Text>
            <Text className="text-slate-400 text-sm text-center mt-2">
                Coming soon — data will appear here once connected to the backend.
            </Text>
        </View>
    );
}