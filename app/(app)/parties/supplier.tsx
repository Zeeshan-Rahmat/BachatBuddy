import ListItemCard from '@/src/components/common/ListItemCard'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import SearchFilter from '@/src/components/common/SearchFilter'
import { ICONS } from '@/src/constants/icons'
import { mockSuppliers } from '@/src/lib/sampleData'
import { FilterType, SupplierType } from '@/src/types/appTypes'
import { handleFilterData } from '@/src/Utility/handleFilterData'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import FilterPartyModal from './filter-party'

export default function SupplierScreen() {

    const suppliers: SupplierType[] = mockSuppliers;

    const [search, setSearch] = useState('');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [displayedSupplier, setDisplayedSupplier] = useState<SupplierType[]>(suppliers);

    const filtered = displayedSupplier.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        // Run advanced filtering logic safely over typed multi-entity datasets
        const output = handleFilterData(filters, suppliers);

        // Update local list layouts and hide selection screen
        setDisplayedSupplier(output as SupplierType[]);
        setIsFilterModalOpen(false);
    };


    return (
        <>
            <PaddingWrapper addPaddingBottom={false}>

                <SearchFilter
                    value={search}
                    searchPlaceholder={"Search Supplier"}
                    onChangeText={setSearch}

                    onFilterPress={() => setIsFilterModalOpen(true)}
                />


                <FlatList data={filtered} keyExtractor={i => i.supplier_id} showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ListItemCard
                            item={item}
                            placeholder={ICONS.COMMON.customer}
                            isParty={true}
                        />
                    )}
                />


            </PaddingWrapper>

            {
                isFilterModalOpen && (
                    <FilterPartyModal
                        visible={isFilterModalOpen}
                        onApplyFilters={onApplyFilters}
                        onClose={() => setIsFilterModalOpen(false)}
                    />
                )
            }
        </>
    )
}