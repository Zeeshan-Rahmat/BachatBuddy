import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import { mockUsers } from '@/src/lib/sampleData';
import { AnyStatusFilterType, DateRangeFilterType, InvoiceStatusFilterType, PartyStatusFilterType, StockStatusFilterType } from '@/src/types/appTypes';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../common/Button';
import IconWrapper from '../common/IconWrapper';
import Title from '../common/Title';
import ValueSelect from '../common/ValueSelect';
import SectionHeader from '../dashboard/SectionHeader';
import DateInput from '../form/DateInput';

interface FilterModalProps {
    visible: boolean;

    fromDate: Date | undefined;
    toDate: Date | undefined;
    selectedUser: string;
    sortBy: string;

    activeRange: DateRangeFilterType;
    activeStatus: AnyStatusFilterType;

    statusValues?: "productStatus" | "invoiceStatus" | "partyStatus";

    handleResetAll: () => void;
    handleApply: () => void;

    setFromDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setToDate: React.Dispatch<React.SetStateAction<Date | undefined>>;

    setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;

    setActiveRange: React.Dispatch<React.SetStateAction<DateRangeFilterType>>;
    setActiveStatus: React.Dispatch<React.SetStateAction<StockStatusFilterType | InvoiceStatusFilterType | PartyStatusFilterType>>;
}

const USERS = mockUsers.map(user => user.name);
const DATE_RANGES = ['Today', 'This Week', 'This Month']
const SORT_BY = ['Newest to Oldest (Newest First)', 'Oldest to Newest (Oldest First)']

const STATUS_VALUES = {
    productStatus: ['In Stock', 'Low Stock', 'Out of Stock'],
    invoiceStatus: ['Paid', 'Pending', 'Unpaid'],
    partyStatus: ['Active', 'Inactive'],
}

const FilterModal = ({
    visible,

    fromDate,
    toDate,
    activeRange,
    activeStatus,
    selectedUser,
    sortBy,

    statusValues = "productStatus",

    handleResetAll,
    handleApply,
    setFromDate,
    setToDate,
    setSelectedUser,
    setSortBy,

    setActiveRange,
    setActiveStatus,

}: FilterModalProps

) => {
    return (
        <CustomModal visible={visible}>
            <Title text='Filter Product' className='mb-6' />

            {/* <ScrollView className="max-h-115" showsVerticalScrollIndicator={false}> */}
            <ScrollView showsVerticalScrollIndicator={false}>

                <SectionHeader
                    title='Added On'
                    insteadOfViewMore='Reset'
                    onPress={() => { setFromDate(undefined); setToDate(undefined); setActiveRange(''); }}
                    marginTop={5}
                />

                <View className="flex-row gap-x-3">
                    <DateInput
                        flex={1}
                        date={fromDate}
                        onDateChange={(newDate) => {
                            setFromDate(newDate);
                        }}
                        placeholder="From Date"
                        icon={<IconWrapper name={ICONS.COMMON.date} />}
                        activeIcon={<IconWrapper name={ICONS.COMMON.activeDate} />}
                    />

                    <DateInput
                        flex={1}
                        date={toDate}
                        onDateChange={(newDate) => {
                            setToDate(newDate);
                        }}
                        placeholder="To Date"
                        icon={<IconWrapper name={ICONS.COMMON.date} />}
                        activeIcon={<IconWrapper name={ICONS.COMMON.activeDate} />}
                    />
                </View>


                <View className="flex-row gap-x-2.5 mb-5">
                    {(DATE_RANGES).map((range) => {
                        const isSelected = activeRange === range;
                        return <FilterDateStatusCard
                            key={range}
                            label={range}
                            isSelected={isSelected}
                            onPress={(val) => setActiveRange(val as DateRangeFilterType)}
                        />;
                    })}
                </View>

                {/* ROW 2 */}
                <SectionHeader
                    title='Status'
                    insteadOfViewMore='Reset'
                    onPress={() => setActiveStatus('')}
                    marginTop={5}
                />

                <View className="flex-row gap-x-2.5 mb-5">
                    {(STATUS_VALUES[statusValues]).map((status) => {
                        const isSelected = activeStatus === status;
                        return <FilterDateStatusCard
                            key={status}
                            label={status}
                            isSelected={isSelected}
                            onPress={(val) => setActiveStatus(val as AnyStatusFilterType)}
                        />;
                    })}
                </View>


                {/* ROW 3 */}
                <SectionHeader
                    title='Added or Updated By'
                    insteadOfViewMore='Reset'
                    onPress={() => setSelectedUser('')}
                    marginTop={5}
                />

                <ValueSelect
                    icon={<Entypo name="add-to-list" size={24} color={COLORS.placeholder} />}
                    value={selectedUser}
                    values={USERS}
                    placeholder='Select User'
                    onChange={setSelectedUser}
                />


                {/* ROW 4 */}
                <SectionHeader
                    title='Sort By'
                    insteadOfViewMore='Reset'
                    onPress={() => setSortBy('')}
                    marginTop={5}
                />

                <ValueSelect
                    icon={<MaterialCommunityIcons name="sort" size={24} color={COLORS.placeholder} />}
                    value={sortBy}
                    values={SORT_BY}
                    placeholder='Select Sort by Date'
                    onChange={setSortBy}
                />

            </ScrollView>

            {/* Buttons */}
            <View className='flex-row gap-4 mt-2'>
                <Button
                    label='Reset All'
                    bgColor='gray'
                    width='flex-1'
                    onPress={handleResetAll}
                />

                <Button
                    label='Apply Filters'
                    width='flex-1'
                    onPress={handleApply}
                />
            </View>

        </CustomModal>
    )
}

export default FilterModal

interface FilterCardProps {
    label: string;
    onPress: (value: string) => void;
    isSelected: boolean;
}

// 1. Wrap props in curly braces {} 
// 2. Add the return type : React.JSX.Element
function FilterDateStatusCard({ label, onPress, isSelected }: FilterCardProps): React.JSX.Element {
    return (
        <TouchableOpacity
            onPress={() => onPress(label)}
            className={`flex-1 h-12 rounded-button border items-center justify-center 
                ${isSelected ? 'bg-primary-400/10 border-primary-400/30' : 'bg-white border-light-100'}`}
        >
            <Text className={`text-[12px] font-semibold ${isSelected ? 'text-primary-500' : 'text-dark-50'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}