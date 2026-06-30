import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import ListItemCard from '@/src/components/common/ListItemCard';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { listCustomers } from '@/src/db/repositories/customersRepository';
import { updateInvoiceDetail } from '@/src/db/repositories/invoicesRepository';
import { mapCustomerRowToAppCustomer } from '@/src/services/invoice/invoiceUiMapper';
import { useAuthStore } from '@/src/store/authStore';
import { CustomerType } from '@/src/types/appTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import EditCustomerSupplierModal from '../parties/add-customer-supplier';

interface EditInvoiceCustomerModalProps {
    visible: boolean;
    invoiceId?: string;
    selectedCustomer?: CustomerType;
    setSelectedCustomer?: React.Dispatch<React.SetStateAction<CustomerType | undefined>>;
    onClose: () => void;
    onSaved?: () => void;
}

const EditInvoiceCustomerModal = ({
    visible,
    invoiceId,
    selectedCustomer,
    setSelectedCustomer,
    onClose,
    onSaved

}: EditInvoiceCustomerModalProps

) => {
    const currentUser = useAuthStore((state) => state.user);
    const requiresApproval = useAuthStore((state) => state.requiresApproval);

    const [customers, setCustomers] = useState<CustomerType[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingCustomerId, setSavingCustomerId] = useState<string | null>(null);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
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

    const handleSelectedCustomer = async (customer: CustomerType) => {
        if (!invoiceId) {
            setSelectedCustomer && setSelectedCustomer(customer);
            onClose();
            return;
        }

        setSavingCustomerId(customer.customer_id);

        try {
            await updateInvoiceDetail(invoiceId, {
                lastUpdatedById: currentUser?.id ?? null,
                customerId: customer.customer_id,
                requiresApproval: requiresApproval(),
            });

            setSelectedCustomer && setSelectedCustomer(customer);
            onSaved?.();
            onClose();
        } catch (error) {
            Alert.alert(
                'Update failed',
                error instanceof Error ? error.message : 'Unable to update this invoice customer locally.',
            );
        } finally {
            setSavingCustomerId(null);
        }
    }

    return (
        <>
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

                <View className='flex-row gap-4'>
                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                        label='CANCEL'
                        bgColor='gray'
                        width='flex-1'
                        isDisabled={Boolean(savingCustomerId)}
                        onPress={onClose}
                    />

                    <Button
                        leftIcon={
                            savingCustomerId
                                ? undefined
                                : <IconWrapper name={ICONS.COMMON.plus} />
                        }
                        label={savingCustomerId ? 'SAVING...' : 'NEW'}
                        width='flex-1'
                        isDisabled={Boolean(savingCustomerId)}
                        onPress={() => setIsAddCustomerOpen(true)}
                    />
                </View>
            </CustomModal>

            {isAddCustomerOpen && (
                <EditCustomerSupplierModal
                    visible={isAddCustomerOpen}
                    title='Add Customer'
                    onClose={() => setIsAddCustomerOpen(false)}
                    onSaved={loadCustomers}
                />
            )}
        </>
    )
}

export default EditInvoiceCustomerModal
