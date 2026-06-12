import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import { ICONS } from '@/src/constants/icons';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

const MOCK_SALES = [
    { id: '1', name: 'Rahmat Ullah', city: 'Togh Sarai', amount: 49999, status: 'Paid', updatedBy: 'Zeeshan Ullah (You)', time: 'Today' },
    { id: '2', name: 'Ahmad Aslam', city: 'Kahi', amount: 1100, status: 'Pending', updatedBy: 'Mubashir Shah', time: '2d ago' },
    { id: '3', name: 'Junaid Rehman', city: 'Kohat', amount: 95000, status: 'Unpaid', updatedBy: 'Qamar Ahmad', time: 'Yesterday' },
    { id: '4', name: 'Rahmat Ullah', city: 'Togh Sarai', amount: 49999, status: 'Paid', updatedBy: 'Zafar Iqbal', time: 'Today' },
    { id: '5', name: 'Ahmad Aslam', city: 'Kahi', amount: 1100, status: 'Pending', updatedBy: 'Zeeshan Ullah (You)', time: '2d ago' },
    { id: '6', name: 'Rahmat Ullah', city: 'Togh Sarai', amount: 49999, status: 'Paid', updatedBy: 'Zafar Iqbal', time: 'Today' },
    { id: '7', name: 'Ahmad Aslam', city: 'Kahi', amount: 1100, status: 'Pending', updatedBy: 'Zeeshan Ullah (You)', time: '2d ago' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'Paid': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    'Pending': { bg: 'bg-amber-100', text: 'text-amber-600' },
    'Unpaid': { bg: 'bg-rose-100', text: 'text-rose-600' },
};

export default function SaleScreen() {
    const [search, setSearch] = useState('');
    const filtered = MOCK_SALES.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>
                <PaddingWrapper addPaddingBottom={false}>

                    <SearchFilter
                        value={search}
                        onChangeText={setSearch}
                    />

                    <FlatList
                        data={filtered}
                        keyExtractor={i => i.id}
                        showsVerticalScrollIndicator={false}

                        renderItem={({ item }) => {

                            return (
                                <ListItemCard
                                    item={{ title: item.name + " - " + item.city, ...item }}
                                    placeholder={ICONS.COMMON.sale}
                                    isInvoice={true}
                                />
                            );
                        }}
                    />

                </PaddingWrapper>
            </ScreenWrapper>


            <RoundedIconButton />
        </View>
    );
}