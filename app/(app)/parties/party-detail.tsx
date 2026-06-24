import Avatar from '@/src/components/common/Avatar';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import CustomModal from '@/src/components/modal/CustomModal';
import CloseButton from '@/src/components/ui/CloseButton';
import InfoField from '@/src/components/ui/InfoField';
import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import { PartyType } from '@/src/types/appTypes';
import { formatDateTime } from '@/src/Utility/DateFunctions';
import { getStatusRGBColor } from '@/src/Utility/getStatusColor';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PartyDetailModalProps {
    visible: boolean;
    party: PartyType;
    onClose: () => void;
}

export default function PartyDetailModal({ visible, party, onClose }: PartyDetailModalProps) {


    const [showMore, setShowMore] = useState(false)

    return (
        <CustomModal visible={visible}>
            <View className='items-center'>
                <Avatar name={party.name} size={100} color='dark' textSize='extraLarge' />

                <View className='items-center mt-4 mb-8 gap-1'>
                    <Text className='text-2xl font-semibold'>{party.name}</Text>
                    <Text className='text-dark-50'>{party.email}</Text>
                </View>
            </View>

            <View className='bg-light-300 rounded-button gap-2 p-2'>
                <InfoField label='Status' value={party.status} valueColor={getStatusRGBColor(party.status)} />
                {'username' in party && <InfoField label='User Name' value={party.username} />}
                <InfoField label='Phone' value={party.phone} />
                <InfoField label='Address' value={party.address ?? "Not Added"} />
            </View>

            {
                'total_orders' in party && 'total_purchases' in party && 'pending_dues' in party &&
                (
                    <>
                        <SectionHeader title='CUSTOMER LEDGER' fontSize={16} marginTop={16} marginBottom={8} textColor={COLORS.dark100} hasViewMore={false} />
                        <View className='bg-light-300 rounded-button gap-2 p-2'>
                            <InfoField label='Total No. of Orders' value={party.total_orders.toString()} />
                            <InfoField label='Total Purchases' value={party.total_purchases.toString()} />
                            <InfoField label='Total Pending Dues' value={party.pending_dues.toString()} />
                        </View>
                    </>
                )
            }

            <View className='bg-light-300 rounded-button gap-2 p-2 mt-4'>

                <InfoField label='Created by' value={party.created_by.name} />
                {
                    showMore
                        ? (
                            <TouchableOpacity
                                onPress={() => setShowMore(false)}
                                className='gap-2'
                            >
                                <InfoField label='Created at' value={formatDateTime(party.created_at)} />
                                <InfoField label='Updated by' value={party.last_updated_by.name} />
                                <InfoField label='Last Updated at' value={formatDateTime(party.last_updated_at)} />
                            </TouchableOpacity>
                        )
                        : (
                            <View className='justify-center items-center '>
                                <TouchableOpacity
                                    onPress={() => setShowMore(true)}
                                    className='px-5 py-1.5 rounded-button w-fit bg-dark-50/10'
                                >
                                    <Text className='text-sm font-medium'>See More</Text>
                                </TouchableOpacity>
                            </View>
                        )
                }
            </View>

            {/* Buttons */}
            <View className='flex-row gap-4 mt-3'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.deleteWhite} />}
                    label='REMOVE'
                    bgColor='red'
                    width='flex-1'
                // onPress={onRemove}
                />

                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.editWhite} />}
                    label='EDIT'
                    width='flex-1'
                // onPress={onEdit}
                />
            </View>

            <CloseButton top={12} right={12} onClose={onClose} />
        </CustomModal>
    )
}