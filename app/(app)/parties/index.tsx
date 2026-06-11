// app/(app)/parties/index.tsx
import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import { ICONS } from '@/src/constants/icons';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

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
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>
                {/* Internal tab bar */}
                <View className="flex-row border-b border-light-100 bg-white">
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
                <PaddingWrapper>


                    <SearchFilter
                        value={search}
                        onChangeText={setSearch}
                    />

                    {activeTab === 'Customers' ? (
                        <FlatList data={filtered} keyExtractor={i => i.id} showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <ListItemCard
                                    item={{ title: item.name + " - " + item.city, ...item }}
                                    placeholder={ICONS.COMMON.customer}
                                    isInvoice={true}
                                />
                            )}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text style={{ fontSize: 48 }}>👥</Text>
                            <Text className="text-slate-500 mt-3 font-medium">{activeTab} list coming soon</Text>
                        </View>
                    )}

                </PaddingWrapper>
            </ScreenWrapper>


            <RoundedIconButton />
        </View>
    );
}