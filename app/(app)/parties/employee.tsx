import ListItemCard from '@/src/components/common/ListItemCard'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import RoundedIconButton from '@/src/components/common/RoundedIconButton'
import SearchFilter from '@/src/components/common/SearchFilter'
import DeleteModal from '@/src/components/modal/DeleteModal'
import { defaultEmployee } from '@/src/constants/defaultData'
import { ICONS } from '@/src/constants/icons'
import { mockEmployees } from '@/src/lib/sampleData'
import { EmployeeType, FilterType } from '@/src/types/appTypes'
import { handleFilterData } from '@/src/Utility/handleFilterData'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import AddEditEmployeeModal from './add-employee'
import FilterPartyModal from './filter-party'
import PartyDetailModal from './party-detail'

export default function EmployeeScreen() {

    const employees: EmployeeType[] = mockEmployees;

    const [search, setSearch] = useState('');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | undefined>(undefined);

    const [displayedEmployee, setDisplayedEmployee] = useState<EmployeeType[]>(employees);

    const filtered = displayedEmployee.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        // Run advanced filtering logic safely over typed multi-entity datasets
        const output = handleFilterData(filters, employees);

        // Update local list layouts and hide selection screen
        setDisplayedEmployee(output as EmployeeType[]);
        setIsFilterModalOpen(false);
    };

    const handleListItemPress = (employee: EmployeeType) => {
        setSelectedEmployee(employee)
        setIsPartyDetailModalOpen(true)
    }

    const handleDelete = () => {
        setIsDeleteModalOpen(false);
        setIsPartyDetailModalOpen(false)
    }

    return (
        <>
            <PaddingWrapper addPaddingBottom={false}>

                <SearchFilter
                    value={search}
                    searchPlaceholder={"Search Customer"}
                    onChangeText={setSearch}

                    onFilterPress={() => setIsFilterModalOpen(true)}
                />


                <FlatList data={filtered} keyExtractor={i => i.employee_id} showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ListItemCard
                            item={item}
                            placeholder={ICONS.COMMON.customer}
                            isParty={true}
                            onPress={() => handleListItemPress(item)}
                        />
                    )}
                />


            </PaddingWrapper>

            <RoundedIconButton
                bottom={25}
                onPress={() => setIsAddEmployeeModalOpen(true)}
            />

            {
                isFilterModalOpen && (
                    <FilterPartyModal
                        visible={isFilterModalOpen}
                        onApplyFilters={onApplyFilters}
                        onClose={() => setIsFilterModalOpen(false)}
                    />
                )
            }

            {
                isPartyDetailModalOpen &&
                <PartyDetailModal
                    visible={isPartyDetailModalOpen}
                    party={selectedEmployee ?? defaultEmployee}
                    onClose={() => setIsPartyDetailModalOpen(false)}
                    onRemove={() => setIsDeleteModalOpen(true)}
                    onEdit={() => setIsEditEmployeeModalOpen(true)}
                />
            }

            {
                isDeleteModalOpen &&
                <DeleteModal
                    title='Remove Customer'
                    subtitle='You are going to remove below customer'
                    removeItem={selectedEmployee?.name ?? "Unknown"}
                    isVisible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            }

            {
                isEditEmployeeModalOpen &&
                <AddEditEmployeeModal
                    visible={isEditEmployeeModalOpen}
                    employee={selectedEmployee}
                    onClose={() => setIsEditEmployeeModalOpen(false)}
                />
            }

            {
                isAddEmployeeModalOpen &&
                <AddEditEmployeeModal
                    visible={isAddEmployeeModalOpen}
                    title='Add Employee'
                    onClose={() => setIsAddEmployeeModalOpen(false)}
                />
            }
        </>
    )
}