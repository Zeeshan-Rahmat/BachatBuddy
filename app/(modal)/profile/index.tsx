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
import EditProfileModal from './edit-profile';

const ProfileScreen = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const displayName = user?.name ?? 'Profile';
    const displayEmail = user?.email ?? 'Not Added';

    return (
        <ScreenWrapper
            title='Profile'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>
                <View className='items-center mt-2'>
                    <Avatar
                        name={displayName}
                        img={user?.img ?? undefined}
                        size={100}
                        color='dark'
                        textSize='extraLarge'
                    />

                    <View className='items-center mt-4 mb-5 gap-1'>
                        <Text className='text-2xl font-semibold'>{displayName}</Text>
                        <Text className='text-dark-50'>{displayEmail}</Text>
                    </View>

                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.editWhite} />}
                        label='Edit Profile'
                        width='w-fit'
                        onPress={() => setIsOpen(true)}
                        isDisabled={!user}
                    />
                </View>

                <View className='flex-1 mt-8 gap-5'>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='User Name' value={user?.username ?? 'Not Added'} />
                        <InfoField label='Name' value={user?.name ?? 'Not Added'} />
                        <InfoField label='Address' value={user?.address ?? 'Not Added'} />
                    </View>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='Phone' value={user?.phone ?? 'Not Added'} />
                        <InfoField label='Email' value={user?.email ?? 'Not Added'} />
                    </View>
                </View>
            </PaddingWrapper>

            {isOpen && user && <EditProfileModal visible={isOpen} user={user} onClose={() => setIsOpen(false)} />}
        </ScreenWrapper>
    );
};

export default ProfileScreen;
