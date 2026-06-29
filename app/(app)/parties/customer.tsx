import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import DeleteModal from '@/src/components/modal/DeleteModal';
import { defaultCustomer } from '@/src/constants/defaultData';
import { ICONS } from '@/src/constants/icons';
import { listCustomersWithRelations, markCustomerPendingDelete } from '@/src/db/repositories/customersRepository';
import { mapCustomerRowToPartyCustomer } from '@/src/services/parties/partyUiMapper';
import { useAuthStore } from '@/src/store/authStore';
import { CustomerType, FilterType } from '@/src/types/appTypes';
import { handleFilterData } from '@/src/Utility/handleFilterData';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import EditCustomerSupplierModal from './add-customer-supplier';
import FilterPartyModal from './filter-party';
import PartyDetailModal from './party-detail';

export default function CustomerScreen() {
    const requiresApproval = useAuthStore((state) => state.requiresApproval);
    const [customers, setCustomers] = useState<CustomerType[]>([]);
    const [displayedCustomer, setDisplayedCustomer] = useState<CustomerType[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditCustomerSupplierModalOpen, setIsEditCustomerSupplierModalOpen] = useState(false);
    const [isAddCustomerSupplierModalOpen, setIsAddCustomerSupplierModalOpen] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState<CustomerType>(defaultCustomer);

    const loadCustomers = useCallback(async () => {
        setLoading(true);

        try {
            const rows = await listCustomersWithRelations();
            const mappedCustomers = rows.map(mapCustomerRowToPartyCustomer);
            setCustomers(mappedCustomers);
            setDisplayedCustomer(mappedCustomers);
        } catch {
            Alert.alert('Load failed', 'Unable to load customers from local storage.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadCustomers();
        }, [loadCustomers])
    );

    const filtered = displayedCustomer.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        const output = handleFilterData(filters, customers);
        setDisplayedCustomer(output as CustomerType[]);
        setIsFilterModalOpen(false);
    };

    const handleDelete = async () => {
        const deleted = await markCustomerPendingDelete(selectedCustomer.customer_id, requiresApproval());

        if (!deleted) {
            Alert.alert('Remove failed', 'This customer could not be found in local storage.');
            return;
        }

        setIsDeleteModalOpen(false);
        setIsPartyDetailModalOpen(false);
        await loadCustomers();
    };

    const handleSaved = async () => {
        setIsEditCustomerSupplierModalOpen(false);
        setIsAddCustomerSupplierModalOpen(false);
        setIsPartyDetailModalOpen(false);
        await loadCustomers();
    };

    return (
        <View className="flex-1">
            <PaddingWrapper addPaddingBottom={false}>
                <SearchFilter
                    value={search}
                    searchPlaceholder="Search Customer"
                    onChangeText={setSearch}
                    onFilterPress={() => setIsFilterModalOpen(true)}
                />

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.customer_id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCustomers} />}
                    ListEmptyComponent={
                        loading
                            ? <ActivityIndicator className="my-8" />
                            : <Text className="text-center text-dark-50 my-8">No customers found</Text>
                    }
                    renderItem={({ item }) => (
                        <ListItemCard
                            item={item}
                            placeholder={ICONS.COMMON.customer}
                            isParty
                            onPress={() => {
                                setSelectedCustomer(item);
                                setIsPartyDetailModalOpen(true);
                            }}
                        />
                    )}
                />
            </PaddingWrapper>

            <RoundedIconButton
                bottom={25}
                onPress={() => setIsAddCustomerSupplierModalOpen(true)}
            />

            {isFilterModalOpen && (
                <FilterPartyModal
                    visible={isFilterModalOpen}
                    onApplyFilters={onApplyFilters}
                    onClose={() => setIsFilterModalOpen(false)}
                />
            )}

            {isPartyDetailModalOpen && (
                <PartyDetailModal
                    visible={isPartyDetailModalOpen}
                    party={selectedCustomer}
                    onClose={() => setIsPartyDetailModalOpen(false)}
                    onRemove={() => setIsDeleteModalOpen(true)}
                    onEdit={() => setIsEditCustomerSupplierModalOpen(true)}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    title="Remove Customer"
                    subtitle="You are going to remove below customer"
                    removeItem={selectedCustomer.name}
                    isVisible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            )}

            {isEditCustomerSupplierModalOpen && (
                <EditCustomerSupplierModal
                    visible={isEditCustomerSupplierModalOpen}
                    customerOrSupplier={selectedCustomer}
                    onClose={() => setIsEditCustomerSupplierModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}

            {isAddCustomerSupplierModalOpen && (
                <EditCustomerSupplierModal
                    visible={isAddCustomerSupplierModalOpen}
                    title="Add Customer"
                    onClose={() => setIsAddCustomerSupplierModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}
        </View>
    );
}
