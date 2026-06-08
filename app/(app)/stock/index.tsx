// app/(app)/stock/index.tsx
import { ScreenWrapper } from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MOCK_STOCK = [
    { id: '1', name: 'Smart Watch Series 5', qty: 14, price: 49999, status: 'In Stock', updatedBy: 'Zeeshan Ullah (You)', time: 'Today' },
    { id: '2', name: 'USB-C Charging Cable', qty: 3, price: 300, status: 'Low Stock', updatedBy: 'Mubashir Shah', time: '2d ago' },
    { id: '3', name: 'Laptop Stand Aluminium', qty: 0, price: 800, status: 'Out of Stock', updatedBy: 'Qamar Ahmad', time: 'Yesterday' },
    { id: '4', name: 'Smart Watch Series 5', qty: 14, price: 49999, status: 'In Stock', updatedBy: 'Zafar Iqbal', time: 'Today' },
    { id: '5', name: 'USB-C Charging Cable', qty: 3, price: 300, status: 'Low Stock', updatedBy: 'Zeeshan Ullah (You)', time: '5d ago' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'In Stock': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    'Low Stock': { bg: 'bg-amber-100', text: 'text-amber-600' },
    'Out of Stock': { bg: 'bg-rose-100', text: 'text-rose-600' },
};

export default function StockScreen() {
    const [search, setSearch] = useState('');

    const filtered = MOCK_STOCK.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-slate-50">
            {/* We render header + bottom nav manually for FlatList performance */}
            <ScreenWrapper scrollable={false}>
                {/* Search row */}
                <View className="flex-row items-center px-4 py-3 gap-3">
                    <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3 h-12"
                        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                        <Text className="text-slate-400 mr-2">🔍</Text>
                        <TextInput
                            className="flex-1 text-slate-800 text-sm"
                            placeholder="Search Items"
                            placeholderTextColor="#94a3b8"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center"
                        style={{ elevation: 3 }}>
                        <Text style={{ fontSize: 18 }}>⚗</Text>
                    </TouchableOpacity>
                </View>

                {/* Stock list */}
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                    renderItem={({ item }) => {
                        const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS['In Stock'];
                        return (
                            <TouchableOpacity className="bg-white rounded-2xl mb-3 p-4 flex-row items-center"
                                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                                {/* Image placeholder */}
                                <View className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 mr-4 items-center justify-center">
                                    <Text style={{ fontSize: 28 }}>📦</Text>
                                </View>
                                {/* Info */}
                                <View className="flex-1">
                                    <Text className="text-slate-900 font-bold text-base mb-0.5">{item.name}</Text>
                                    <Text className="text-slate-400 text-xs mb-1.5">
                                        Updated by <Text className="font-semibold text-slate-600">{item.updatedBy}</Text> • {item.time}
                                    </Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-emerald-600 font-bold text-sm">
                                            {item.qty} in Stock
                                        </Text>
                                        <Text className="text-slate-300">|</Text>
                                        <Text className="text-emerald-600 font-bold text-sm">
                                            PKR {item.price.toLocaleString()}
                                        </Text>
                                        <View className={`ml-auto px-2.5 py-1 rounded-lg ${colors.bg}`}>
                                            <Text className={`text-xs font-semibold ${colors.text}`}>{item.status}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </ScreenWrapper>

            {/* FAB */}
            <TouchableOpacity
                className="absolute right-6 bottom-24 w-14 h-14 bg-emerald-500 rounded-full items-center justify-center"
                style={{ elevation: 8, shadowColor: '#10b981', shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
                <Text className="text-white text-3xl font-light">+</Text>
            </TouchableOpacity>
        </View>
    );
}