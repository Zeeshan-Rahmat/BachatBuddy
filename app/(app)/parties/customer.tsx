import ListItemCard from '@/src/components/common/ListItemCard'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import RoundedIconButton from '@/src/components/common/RoundedIconButton'
import SearchFilter from '@/src/components/common/SearchFilter'
import DeleteModal from '@/src/components/modal/DeleteModal'
import { defaultCustomer } from '@/src/constants/defaultData'
import { ICONS } from '@/src/constants/icons'
import { mockCustomers } from '@/src/lib/sampleData'
import { CustomerType, FilterType } from '@/src/types/appTypes'
import { handleFilterData } from '@/src/Utility/handleFilterData'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import EditCustomerSupplierModal from './add-customer-supplier'
import FilterPartyModal from './filter-party'
import PartyDetailModal from './party-detail'

export default function CustomerScreen() {

    const customers: CustomerType[] = mockCustomers;

    const [search, setSearch] = useState('');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditCustomerSupplierModalOpen, setIsEditCustomerSupplierModalOpen] = useState(false);
    const [isAddCustomerSupplierModalOpen, setIsAddCustomerSupplierModalOpen] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | undefined>(undefined);

    const [displayedCustomer, setDisplayedCustomer] = useState<CustomerType[]>(customers);

    const filtered = displayedCustomer.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        // Run advanced filtering logic safely over typed multi-entity datasets
        const output = handleFilterData(filters, customers);

        // Update local list layouts and hide selection screen
        setDisplayedCustomer(output as CustomerType[]);
        setIsFilterModalOpen(false);
    };

    const handleListItemPress = (customer: CustomerType) => {
        setSelectedCustomer(customer)
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


                <FlatList data={filtered} keyExtractor={i => i.customer_id} showsVerticalScrollIndicator={false}
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
                onPress={() => setIsAddCustomerSupplierModalOpen(true)}
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
                    party={selectedCustomer ?? defaultCustomer}
                    onClose={() => setIsPartyDetailModalOpen(false)}
                    onRemove={() => setIsDeleteModalOpen(true)}
                    onEdit={() => setIsEditCustomerSupplierModalOpen(true)}
                />
            }

            {
                isDeleteModalOpen &&
                <DeleteModal
                    title='Remove Customer'
                    subtitle='You are going to remove below customer'
                    removeItem={selectedCustomer?.name ?? "Unknown"}
                    isVisible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            }

            {
                isEditCustomerSupplierModalOpen &&
                <EditCustomerSupplierModal
                    visible={isEditCustomerSupplierModalOpen}
                    customerOrSupplier={selectedCustomer}
                    onClose={() => setIsEditCustomerSupplierModalOpen(false)}
                />
            }

            {
                isAddCustomerSupplierModalOpen &&
                <EditCustomerSupplierModal
                    visible={isAddCustomerSupplierModalOpen}
                    title='Add Customer'
                    onClose={() => setIsAddCustomerSupplierModalOpen(false)}
                />
            }
        </>
    )
}