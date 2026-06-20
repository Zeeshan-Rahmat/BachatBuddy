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
    selectedSupplier?: SupplierType;
    setSelectedSupplier?: React.Dispatch<React.SetStateAction<SupplierType | undefined>>;
    onSelected: () => void;
}

const AddProductSupplierModal = ({ visible, selectedSupplier, setSelectedSupplier, onSelected }: AddProductSupplierModalProps) => {

    const suppliers = mockSuppliers;

    const [search, setSearch] = useState('');

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectSupplier = (supplier: SupplierType) => {

        setSelectedSupplier && setSelectedSupplier(supplier);
        onSelected();
    }

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

                renderItem={({ item: supplier }) => (
                    <ListItemCard
                        item={supplier}
                        placeholder={ICONS.COMMON.customer}
                        isParty={true}
                        isSelected={selectedSupplier ? supplier.supplier_id === selectedSupplier.supplier_id : false}
                        onPress={() => handleSelectSupplier(supplier)}
                    />
                )}
            />
        </CustomModal>
    )
}

export default AddProductSupplierModal