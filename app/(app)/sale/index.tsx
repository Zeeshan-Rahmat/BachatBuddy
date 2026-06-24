import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { mockInvoices } from '@/src/lib/sampleData';
import { FilterType, InvoiceType } from '@/src/types/appTypes';
import { handleFilterData } from '@/src/Utility/handleFilterData';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import FilterInvoiceModal from './filter-invoice';

export default function SaleScreen() {

    const invoices: InvoiceType[] = mockInvoices;

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [displayedStock, setDisplayedStock] = useState<InvoiceType[]>(invoices);

    const [search, setSearch] = useState('');
    const filtered = displayedStock.filter(i => i.invoice_number.toLowerCase().includes(search.toLowerCase()));

    const onApplyFilters = (filters: FilterType) => {
        // Run advanced filtering logic safely over typed multi-entity datasets
        const output = handleFilterData(filters, invoices);

        // Update local list layouts and hide selection screen
        setDisplayedStock(output as InvoiceType[]);
        setIsFilterModalOpen(false);
    };

    const onInvoicePress = (invoiceId: string) => {
        router.push({
            pathname: ROUTES.SALE.INVOICE_DETAILS,
            params: { id: invoiceId }
        });
    }

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>
                <PaddingWrapper addPaddingBottom={false}>

                    <SearchFilter
                        value={search}
                        searchPlaceholder="Search Invoices"
                        onChangeText={setSearch}
                        onFilterPress={() => setIsFilterModalOpen(true)}
                    />

                    <FlatList
                        data={filtered}
                        keyExtractor={i => i.invoice_id}
                        showsVerticalScrollIndicator={false}

                        renderItem={({ item }) => {

                            return (
                                <ListItemCard
                                    item={item}
                                    placeholder={ICONS.COMMON.sale}
                                    isInvoice={true}
                                    onPress={() => onInvoicePress(item.invoice_id)}
                                />
                            );
                        }}
                    />

                </PaddingWrapper>
            </ScreenWrapper>


            <RoundedIconButton onPress={() => router.push(ROUTES.SALE.ADD_INVOICE)} />

            {
                isFilterModalOpen && (
                    <FilterInvoiceModal
                        visible={isFilterModalOpen}
                        onApplyFilters={onApplyFilters}
                        onClose={() => setIsFilterModalOpen(false)}
                    />
                )
            }
        </View>
    );
}