// app/(app)/stock/index.tsx
import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import { ICONS } from '@/src/constants/icons';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

const MOCK_STOCK = [
    { id: '1', title: 'Smart Watch Series 5', qty: 14, price: 49999, status: 'In Stock', updatedBy: 'Zeeshan Ullah (You)', time: 'Today' },
    { id: '2', title: 'USB-C Charging Cable', qty: 3, price: 300, status: 'Low Stock', updatedBy: 'Mubashir Shah', time: '2d ago' },
    { id: '3', title: 'Laptop Stand Aluminium', qty: 0, price: 800, status: 'Out of Stock', updatedBy: 'Qamar Ahmad', time: 'Yesterday' },
    { id: '4', title: 'Smart Watch Series 5', qty: 14, price: 49999, status: 'In Stock', updatedBy: 'Zafar Iqbal', time: 'Today' },
    { id: '5', title: 'USB-C Charging Cable', qty: 3, price: 300, status: 'Low Stock', updatedBy: 'Zeeshan Ullah (You)', time: '5d ago' },
];

export default function StockScreen() {
    const [search, setSearch] = useState('');

    const filtered = MOCK_STOCK.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1">

            <ScreenWrapper scrollable={false}>
                <PaddingWrapper>


                    <SearchFilter
                        value={search}
                        onChangeText={setSearch}
                    />


                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        renderItem={({ item }) => {
                            return (
                                <ListItemCard item={item} placeholder={ICONS.COMMON.product} isProduct={true} />
                            );
                        }}
                    />

                </PaddingWrapper>
            </ScreenWrapper>


            <RoundedIconButton />
        </View>
    );
}