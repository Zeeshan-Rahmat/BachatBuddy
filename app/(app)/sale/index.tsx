import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MOCK_SALES = [
    { id: '1', customer: 'Rahmat Ullah', city: 'Togh Sarai', amount: 49999, status: 'Paid', updatedBy: 'Zeeshan Ullah (You)', time: 'Today' },
    { id: '2', customer: 'Ahmad Aslam', city: 'Kahi', amount: 1100, status: 'Pending', updatedBy: 'Mubashir Shah', time: '2d ago' },
    { id: '3', customer: 'Junaid Rehman', city: 'Kohat', amount: 95000, status: 'Unpaid', updatedBy: 'Qamar Ahmad', time: 'Yesterday' },
    { id: '4', customer: 'Rahmat Ullah', city: 'Togh Sarai', amount: 49999, status: 'Paid', updatedBy: 'Zafar Iqbal', time: 'Today' },
    { id: '5', customer: 'Ahmad Aslam', city: 'Kahi', amount: 1100, status: 'Pending', updatedBy: 'Zeeshan Ullah (You)', time: '2d ago' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'Paid': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    'Pending': { bg: 'bg-amber-100', text: 'text-amber-600' },
    'Unpaid': { bg: 'bg-rose-100', text: 'text-rose-600' },
};

export default function SaleScreen() {
    const [search, setSearch] = useState('');
    const filtered = MOCK_SALES.filter(i => i.customer.toLowerCase().includes(search.toLowerCase()));

    return (
        <View className="flex-1 bg-slate-50">
            <ScreenWrapper scrollable={false}>
                <View className="flex-row items-center px-4 py-3 gap-3">
                    <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3 h-12"
                        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                        <Text className="text-slate-400 mr-2">🔍</Text>
                        <TextInput className="flex-1 text-slate-800 text-sm" placeholder="Search Items"
                            placeholderTextColor="#94a3b8" value={search} onChangeText={setSearch} />
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center">
                        <Text style={{ fontSize: 18 }}>⚗</Text>
                    </TouchableOpacity>
                </View>
                <FlatList data={filtered} keyExtractor={i => i.id} showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                    renderItem={({ item }) => {
                        const c = STATUS_COLORS[item.status];
                        return (
                            <TouchableOpacity className="bg-white rounded-2xl mb-3 p-4 flex-row items-center"
                                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                                <View className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 mr-4 items-center justify-center">
                                    <Text style={{ fontSize: 28 }}>🧾</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-900 font-bold text-base mb-0.5">{item.customer} - {item.city}</Text>
                                    <Text className="text-slate-400 text-xs mb-1.5">
                                        Updated by <Text className="font-semibold text-slate-600">{item.updatedBy}</Text> • {item.time}
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-slate-600 text-sm">Amount: </Text>
                                        <Text className="text-emerald-600 font-bold text-sm">PKR {item.amount.toLocaleString()}</Text>
                                        <View className={`ml-auto px-2.5 py-1 rounded-lg ${c.bg}`}>
                                            <Text className={`text-xs font-semibold ${c.text}`}>{item.status}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </ScreenWrapper>
            <TouchableOpacity className="absolute right-6 bottom-24 w-14 h-14 bg-emerald-500 rounded-full items-center justify-center"
                style={{ elevation: 8, shadowColor: '#10b981', shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
                <Text className="text-white text-3xl font-light">+</Text>
            </TouchableOpacity>
        </View>
    );
}