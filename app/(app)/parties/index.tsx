// app/(app)/parties/index.tsx
import InternalTabBar from '@/src/components/common/InternalTabBar';
import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import { ICONS } from '@/src/constants/icons';
import { mockCustomers } from '@/src/lib/sampleData';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const TABS = ['Customers', 'Suppliers', 'Employees'];

export default function PartiesScreen() {

    const customers = mockCustomers;

    const [activeTab, setActiveTab] = useState('Customers');
    const [search, setSearch] = useState('');

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>

                <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

                <PaddingWrapper addPaddingBottom={false}>

                    <SearchFilter
                        value={search}
                        searchPlaceholder={"Search" + activeTab}
                        onChangeText={setSearch}
                    />

                    {activeTab === 'Customers' ? (
                        <FlatList data={filtered} keyExtractor={i => i.customer_id} showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <ListItemCard
                                    item={item}
                                    placeholder={ICONS.COMMON.customer}
                                    isParty={true}
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