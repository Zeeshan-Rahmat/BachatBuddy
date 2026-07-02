import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import DeleteModal from '@/src/components/modal/DeleteModal';
import { defaultSupplier } from '@/src/constants/defaultData';
import { ICONS } from '@/src/constants/icons';
import { listSuppliersWithRelations, markSupplierPendingDelete } from '@/src/db/repositories/suppliersRepository';
import { subscribeToLocalDataChanges } from '@/src/services/localDataChangeNotifier';
import { mapSupplierRowToPartySupplier } from '@/src/services/parties/partyUiMapper';
import { useAuthStore } from '@/src/store/authStore';
import { FilterType, SupplierType } from '@/src/types/appTypes';
import { handleFilterData } from '@/src/Utility/handleFilterData';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import EditCustomerSupplierModal from './add-customer-supplier';
import FilterPartyModal from './filter-party';
import PartyDetailModal from './party-detail';

export default function SupplierScreen() {
    const requiresApproval = useAuthStore((state) => state.requiresApproval);
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [displayedSupplier, setDisplayedSupplier] = useState<SupplierType[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditCustomerSupplierModalOpen, setIsEditCustomerSupplierModalOpen] = useState(false);
    const [isAddCustomerSupplierModalOpen, setIsAddCustomerSupplierModalOpen] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState<SupplierType>(defaultSupplier);

    const loadSuppliers = useCallback(async () => {
        setLoading(true);

        try {
            const rows = await listSuppliersWithRelations();
            const mappedSuppliers = rows.map(mapSupplierRowToPartySupplier);
            setSuppliers(mappedSuppliers);
            setDisplayedSupplier(mappedSuppliers);
        } catch {
            Alert.alert('Load failed', 'Unable to load suppliers from local storage.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadSuppliers();
        }, [loadSuppliers])
    );

    useEffect(() => {
        return subscribeToLocalDataChanges((scope) => {
            if (scope === 'business-data') {
                void loadSuppliers();
            }
        });
    }, [loadSuppliers]);

    const filtered = displayedSupplier.filter((supplier) =>
        supplier.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        const output = handleFilterData(filters, suppliers);
        setDisplayedSupplier(output as SupplierType[]);
        setIsFilterModalOpen(false);
    };

    const handleDelete = async () => {
        const deleted = await markSupplierPendingDelete(selectedSupplier.supplier_id, requiresApproval());

        if (!deleted) {
            Alert.alert('Remove failed', 'This supplier could not be found in local storage.');
            return;
        }

        setIsDeleteModalOpen(false);
        setIsPartyDetailModalOpen(false);
        await loadSuppliers();
    };

    const handleSaved = async () => {
        setIsEditCustomerSupplierModalOpen(false);
        setIsAddCustomerSupplierModalOpen(false);
        setIsPartyDetailModalOpen(false);
        await loadSuppliers();
    };

    return (
        <View className="flex-1">
            <PaddingWrapper addPaddingBottom={false}>
                <SearchFilter
                    value={search}
                    searchPlaceholder="Search Supplier"
                    onChangeText={setSearch}
                    onFilterPress={() => setIsFilterModalOpen(true)}
                />

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.supplier_id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadSuppliers} />}
                    ListEmptyComponent={
                        loading
                            ? <ActivityIndicator className="my-8" />
                            : <Text className="text-center text-dark-50 my-8">No suppliers found</Text>
                    }
                    renderItem={({ item }) => (
                        <ListItemCard
                            item={item}
                            placeholder={ICONS.COMMON.customer}
                            isParty
                            onPress={() => {
                                setSelectedSupplier(item);
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
                    party={selectedSupplier}
                    onClose={() => setIsPartyDetailModalOpen(false)}
                    onRemove={() => setIsDeleteModalOpen(true)}
                    onEdit={() => setIsEditCustomerSupplierModalOpen(true)}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    title="Remove Supplier"
                    subtitle="You are going to remove below supplier"
                    removeItem={selectedSupplier.name}
                    isVisible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            )}

            {isEditCustomerSupplierModalOpen && (
                <EditCustomerSupplierModal
                    visible={isEditCustomerSupplierModalOpen}
                    title="Edit Supplier"
                    customerOrSupplier={selectedSupplier}
                    onClose={() => setIsEditCustomerSupplierModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}

            {isAddCustomerSupplierModalOpen && (
                <EditCustomerSupplierModal
                    visible={isAddCustomerSupplierModalOpen}
                    title="Add Supplier"
                    onClose={() => setIsAddCustomerSupplierModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}
        </View>
    );
}
