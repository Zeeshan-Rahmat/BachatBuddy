// app/(app)/parties/index.tsx
import { ScreenWrapper } from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TABS = ['Customers', 'Suppliers', 'Employees'];

const MOCK_CUSTOMERS = [
    { id: '1', name: 'Ahmad Usman', city: 'Kahi', email: 'ahmadusman@email.com', status: 'Active', updatedBy: 'Zeeshan Ullah (You)', time: 'Today' },
    { id: '2', name: 'Junaid Rehman', city: 'Kohat', email: 'example@email.com', status: 'Active', updatedBy: 'Qamar Ahmad', time: 'Yesterday' },
    { id: '3', name: 'Zahid Asmat', city: 'Thall', email: 'zahidasmat@email.com', status: 'Inactive', updatedBy: 'Muhammad Mubashir', time: '3d' },
    { id: '4', name: 'Ismail Khan', city: 'Kacha Paka', email: 'ismailkhan@email.com', status: 'Inactive', updatedBy: 'Zafar Iqbal', time: 'Yesterday' },
    { id: '5', name: 'Rahmat Ullah', city: 'Togh Sarai', email: 'rahmatullah@email.com', status: 'Active', updatedBy: 'Zeeshan Ullah (You)', time: 'Today' },
    { id: '6', name: 'Nasir Khan', city: 'Hangu', email: 'nasirkhan@email.com', status: 'Active', updatedBy: 'Zeeshan Ullah (You)', time: '1d ago' },
];

export default function PartiesScreen() {
    const [activeTab, setActiveTab] = useState('Customers');
    const [search, setSearch] = useState('');

    const filtered = MOCK_CUSTOMERS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-slate-50">
            <ScreenWrapper scrollable={false}>
                {/* Internal tab bar */}
                <View className="flex-row border-b border-slate-200 bg-white">
                    {TABS.map(tab => (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
                            className="flex-1 items-center py-4">
                            <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {tab}
                            </Text>
                            {activeTab === tab && (
                                <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 rounded-full" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Search */}
                <View className="flex-row items-center px-4 py-3 gap-3">
                    <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3 h-12"
                        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
                        <Text className="text-slate-400 mr-2">🔍</Text>
                        <TextInput className="flex-1 text-slate-800 text-sm"
                            placeholder={`Search ${activeTab}`} placeholderTextColor="#94a3b8"
                            value={search} onChangeText={setSearch} />
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center">
                        <Text style={{ fontSize: 18 }}>⚗</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'Customers' ? (
                    <FlatList data={filtered} keyExtractor={i => i.id} showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="bg-white rounded-2xl mb-3 p-4 flex-row items-center"
                                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                                <View className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 mr-4 items-center justify-center">
                                    <Text style={{ fontSize: 26 }}>👤</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-900 font-bold text-base mb-0.5">
                                        {item.name} - {item.city}
                                    </Text>
                                    <Text className="text-slate-400 text-xs mb-1">
                                        Updated by <Text className="font-semibold text-slate-600">{item.updatedBy}</Text> • {item.time}
                                    </Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-slate-500 text-xs">{item.email}</Text>
                                        <View className={`px-2.5 py-1 rounded-lg ${item.status === 'Active' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                            <Text className={`text-xs font-semibold ${item.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {item.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text style={{ fontSize: 48 }}>👥</Text>
                        <Text className="text-slate-500 mt-3 font-medium">{activeTab} list coming soon</Text>
                    </View>
                )}
            </ScreenWrapper>

            {/* FAB */}
            <TouchableOpacity className="absolute right-6 bottom-24 w-14 h-14 bg-emerald-500 rounded-full items-center justify-center"
                style={{ elevation: 8, shadowColor: '#10b981', shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
                <Text className="text-white text-3xl font-light">+</Text>
            </TouchableOpacity>
        </View>
    );
}