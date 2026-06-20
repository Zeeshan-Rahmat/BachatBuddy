import ListItemCard from '@/src/components/common/ListItemCard';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { mockSuppliers } from '@/src/lib/sampleData';
import { SupplierType } from '@/src/types/appTypes';
import React, { useState } from 'react';
import { FlatList } from 'react-native';

interface AddProductSupplierModalProps {
    visible: boolean;
    selectedSupplier: SupplierType;
    onSelected: () => void;
}

const AddProductSupplierModal = ({ visible, selectedSupplier, onSelected }: AddProductSupplierModalProps) => {

    const suppliers = mockSuppliers;

    const [search, setSearch] = useState('');

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <CustomModal visible={visible}>
            <Title text='Add Supplier' />

            <SearchFilter
                value={search}
                onChangeText={setSearch}
            />

            <FlatList
                data={filtered}
                keyExtractor={i => i.supplier_id}
                showsVerticalScrollIndicator={false}
                className='max-h-120'

                renderItem={({ item }) => (
                    <ListItemCard
                        item={item}
                        placeholder={ICONS.COMMON.customer}
                        isParty={true}
                        isSelected={item.supplier_id === selectedSupplier.supplier_id}
                        onPress={onSelected}
                    />
                )}
            />
        </CustomModal>
    )
}

export default AddProductSupplierModal