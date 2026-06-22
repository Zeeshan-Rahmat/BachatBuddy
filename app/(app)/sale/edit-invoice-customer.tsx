import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import ListItemCard from '@/src/components/common/ListItemCard';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { mockCustomers } from '@/src/lib/sampleData';
import { CustomerType } from '@/src/types/appTypes';
import React, { useState } from 'react';
import { FlatList } from 'react-native';

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

    const customer = mockCustomers;

    const [search, setSearch] = useState('');

    const filtered = customer.filter(s =>
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