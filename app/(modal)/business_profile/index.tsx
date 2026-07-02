import Avatar from '@/src/components/common/Avatar';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import InfoField from '@/src/components/ui/InfoField';
import { ICONS } from '@/src/constants/icons';
import { useAuthStore } from '@/src/store/authStore';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import EditBusinessProfile from './edit-business-profile';

const BusinessProfileScreen = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const isOwner = useAuthStore((state) => state.role) === 'owner';
    const businessName = user?.businessName ?? 'Business Profile';
    const businessEmail = user?.businessEmail ?? 'Not Added';

    return (
        <ScreenWrapper
            title='Business Profile'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>
                <View className='items-center mt-2'>
                    <Avatar
                        name={businessName}
                        img={user?.businessLogo ?? undefined}
                        size={100}
                        color='dark'
                        textSize='extraLarge'
                    />

                    <View className='items-center mt-4 mb-5 gap-1'>
                        <Text className='text-2xl font-semibold'>{businessName}</Text>
                        <Text className='text-dark-50'>{businessEmail}</Text>
                    </View>

                    {isOwner && (
                        <Button
                            leftIcon={<IconWrapper name={ICONS.COMMON.editWhite} />}
                            label='Edit Profile'
                            width='w-fit'
                            onPress={() => setIsOpen(true)}
                            isDisabled={!user}
                        />
                    )}
                </View>

                <View className='flex-1 mt-8 gap-5'>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='Owner' value={user?.name ?? 'Not Added'} />
                        <InfoField label='Name' value={user?.businessName ?? 'Not Added'} />
                        <InfoField label='Address' value={user?.businessAddress ?? 'Not Added'} />
                        <InfoField label='Logo' value={user?.businessLogo ? 'Added' : 'Not Added'} />
                    </View>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='Phone' value={user?.businessPhone ?? 'Not Added'} />
                        <InfoField label='Email' value={user?.businessEmail ?? 'Not Added'} />
                    </View>
                </View>
            </PaddingWrapper>

            {isOwner && user && <EditBusinessProfile visible={isOpen} user={user} onClose={() => setIsOpen(false)} />}
        </ScreenWrapper>
    );
};

export default BusinessProfileScreen;
