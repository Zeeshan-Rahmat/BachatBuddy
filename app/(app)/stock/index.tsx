// app/(app)/stock/index.tsx
import ImageContainer from '@/src/components/common/ImageContainer';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import SearchFilter from '@/src/components/common/SearchFilter';
import { ICONS } from '@/src/constants/icons';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

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
        <View className="flex-1">
            {/* We render header + bottom nav manually for FlatList performance */}
            <ScreenWrapper scrollable={false}>
                <PaddingWrapper>

                    {/* Search row */}
                    <SearchFilter
                        value={search}
                        onChangeText={setSearch}
                    />

                    {/* Stock list */}
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        renderItem={({ item }) => {
                            const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS['In Stock'];
                            return (
                                <TouchableOpacity className="bg-white rounded-button mb-3 p-4 flex-row items-center">
                                    {/* Image placeholder */}
                                    <ImageContainer placeholder={ICONS.COMMON.product} />
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

                </PaddingWrapper>
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