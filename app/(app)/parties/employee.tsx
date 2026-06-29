import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import DeleteModal from '@/src/components/modal/DeleteModal';
import { defaultEmployee } from '@/src/constants/defaultData';
import { ICONS } from '@/src/constants/icons';
import { listEmployees, markEmployeePendingDelete } from '@/src/db/repositories/employeesRepository';
import { mapEmployeeRowToPartyEmployee } from '@/src/services/parties/partyUiMapper';
import { useAuthStore } from '@/src/store/authStore';
import { EmployeeType, FilterType } from '@/src/types/appTypes';
import { handleFilterData } from '@/src/Utility/handleFilterData';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import AddEditEmployeeModal from './add-employee';
import FilterPartyModal from './filter-party';
import PartyDetailModal from './party-detail';

export default function EmployeeScreen() {
    const currentUser = useAuthStore((state) => state.user);
    const requiresApproval = useAuthStore((state) => state.requiresApproval);
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [displayedEmployee, setDisplayedEmployee] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType>(defaultEmployee);

    const loadEmployees = useCallback(async () => {
        setLoading(true);

        try {
            const businessId = currentUser?.businessId ?? currentUser?.id;
            const rows = await listEmployees(businessId);
            const mappedEmployees = rows.map(mapEmployeeRowToPartyEmployee);
            setEmployees(mappedEmployees);
            setDisplayedEmployee(mappedEmployees);
        } catch {
            Alert.alert('Load failed', 'Unable to load employees from local storage.');
        } finally {
            setLoading(false);
        }
    }, [currentUser?.businessId, currentUser?.id]);

    useFocusEffect(
        useCallback(() => {
            void loadEmployees();
        }, [loadEmployees])
    );

    const filtered = displayedEmployee.filter((employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        const output = handleFilterData(filters, employees);
        setDisplayedEmployee(output as EmployeeType[]);
        setIsFilterModalOpen(false);
    };

    const handleDelete = async () => {
        const deleted = await markEmployeePendingDelete(selectedEmployee.employee_id, requiresApproval());

        if (!deleted) {
            Alert.alert('Remove failed', 'This employee could not be found in local storage.');
            return;
        }

        setIsDeleteModalOpen(false);
        setIsPartyDetailModalOpen(false);
        await loadEmployees();
    };

    const handleSaved = async () => {
        setIsEditEmployeeModalOpen(false);
        setIsAddEmployeeModalOpen(false);
        setIsPartyDetailModalOpen(false);
        await loadEmployees();
    };

    return (
        <View className="flex-1">
            <PaddingWrapper addPaddingBottom={false}>
                <SearchFilter
                    value={search}
                    searchPlaceholder="Search Employee"
                    onChangeText={setSearch}
                    onFilterPress={() => setIsFilterModalOpen(true)}
                />

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.employee_id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEmployees} />}
                    ListEmptyComponent={
                        loading
                            ? <ActivityIndicator className="my-8" />
                            : <Text className="text-center text-dark-50 my-8">No employees found</Text>
                    }
                    renderItem={({ item }) => (
                        <ListItemCard
                            item={item}
                            placeholder={ICONS.COMMON.customer}
                            isParty
                            onPress={() => {
                                setSelectedEmployee(item);
                                setIsPartyDetailModalOpen(true);
                            }}
                        />
                    )}
                />
            </PaddingWrapper>

            <RoundedIconButton
                bottom={25}
                onPress={() => setIsAddEmployeeModalOpen(true)}
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
                    party={selectedEmployee}
                    onClose={() => setIsPartyDetailModalOpen(false)}
                    onRemove={() => setIsDeleteModalOpen(true)}
                    onEdit={() => setIsEditEmployeeModalOpen(true)}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    title="Remove Employee"
                    subtitle="You are going to remove below employee"
                    removeItem={selectedEmployee.name}
                    isVisible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            )}

            {isEditEmployeeModalOpen && (
                <AddEditEmployeeModal
                    visible={isEditEmployeeModalOpen}
                    employee={selectedEmployee}
                    onClose={() => setIsEditEmployeeModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}

            {isAddEmployeeModalOpen && (
                <AddEditEmployeeModal
                    visible={isAddEmployeeModalOpen}
                    title="Add Employee"
                    onClose={() => setIsAddEmployeeModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}
        </View>
    );
}
