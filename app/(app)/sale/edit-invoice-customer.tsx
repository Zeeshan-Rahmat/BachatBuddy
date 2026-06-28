import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import ListItemCard from '@/src/components/common/ListItemCard';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { listCustomers } from '@/src/db/repositories/customersRepository';
import { mapCustomerRowToAppCustomer } from '@/src/services/invoice/invoiceUiMapper';
import { CustomerType } from '@/src/types/appTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

interface EditInvoiceCustomerModalProps {
    visible: boolean;
    selectedCustomer?: CustomerType;
    setSelectedCustomer?: React.Dispatch<React.SetStateAction<CustomerType | undefined>>;
    onClose: () => void;
}

const EditInvoiceCustomerModal = ({
    visible,
    selectedCustomer,
    setSelectedCustomer,
    onClose

}: EditInvoiceCustomerModalProps

) => {

    const [customers, setCustomers] = useState<CustomerType[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const loadCustomers = useCallback(async () => {
        setLoading(true);

        try {
            const rows = await listCustomers();
            setCustomers(rows.map(mapCustomerRowToAppCustomer));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            void loadCustomers();
        }
    }, [loadCustomers, visible]);

    const filtered = customers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectedCustomer = (supplier: CustomerType) => {

        setSelectedCustomer && setSelectedCustomer(supplier);
        onClose();
    }

    return (
        <CustomModal visible={visible}>
            <Title text='Add Customer' />

            <SearchFilter
                value={search}
                searchPlaceholder='Search Customers'
                hasFilter={false}
                onChangeText={setSearch}
            />

            <FlatList
                data={filtered}
                keyExtractor={i => i.customer_id}
                showsVerticalScrollIndicator={false}
                className='max-h-120'
                ListEmptyComponent={
                    loading
                        ? <ActivityIndicator className='my-6' />
                        : <Text className='text-center text-dark-50 my-6'>No customers found</Text>
                }

                renderItem={({ item: customer }) => (
                    <ListItemCard
                        item={customer}
                        placeholder={ICONS.COMMON.customer}
                        isParty={true}
                        isSelected={selectedCustomer?.customer_id
                            ? customer.customer_id === selectedCustomer?.customer_id
                            : false}
                        onPress={() => handleSelectedCustomer(customer)}
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

export default EditInvoiceCustomerModal
