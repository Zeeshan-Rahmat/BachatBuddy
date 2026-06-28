import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import ListItemCard from '@/src/components/common/ListItemCard';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { listSuppliers } from '@/src/db/repositories/suppliersRepository';
import { mapSupplierRowToAppSupplier } from '@/src/services/inventory/productUiMapper';
import { SupplierType } from '@/src/types/appTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

interface AddProductSupplierModalProps {
    visible: boolean;
    selectedSupplier?: SupplierType;
    setSelectedSupplier?: React.Dispatch<React.SetStateAction<SupplierType | undefined>>;
    onClose: () => void;
}

const AddProductSupplierModal = ({ visible, selectedSupplier, setSelectedSupplier, onClose }: AddProductSupplierModalProps) => {

    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const loadSuppliers = useCallback(async () => {
        setLoading(true);

        try {
            const rows = await listSuppliers();
            setSuppliers(rows.map(mapSupplierRowToAppSupplier));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            void loadSuppliers();
        }
    }, [loadSuppliers, visible]);

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectSupplier = (supplier: SupplierType) => {

        setSelectedSupplier && setSelectedSupplier(supplier);
        onClose();
    }

    return (
        <CustomModal visible={visible}>
            <Title text='Add Supplier' />

            <SearchFilter
                value={search}
                searchPlaceholder="Search Suppliers"
                onChangeText={setSearch}
                hasFilter={false}
            />

            <FlatList
                data={filtered}
                keyExtractor={i => i.supplier_id}
                showsVerticalScrollIndicator={false}
                className='max-h-120'
                ListEmptyComponent={
                    loading
                        ? <ActivityIndicator className='my-6' />
                        : <Text className='text-center text-dark-50 my-6'>No suppliers found</Text>
                }

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

            <Button
                leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                label='CANCEL'
                bgColor='gray'
                onPress={onClose}
            />
        </CustomModal>
    )
}

export default AddProductSupplierModal
