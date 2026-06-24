import Avatar from '@/src/components/common/Avatar'
import Button from '@/src/components/common/Button'
import IconWrapper from '@/src/components/common/IconWrapper'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import InfoField from '@/src/components/ui/InfoField'
import { ICONS } from '@/src/constants/icons'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import EditProfileModal from './edit-profile'

const ProfileScreen = () => {

    const [isOpen, setIsOpen] = useState(false)

    const defaultUser = {
        id: "ZU1100",
        username: "@zeeshanullah",
        name: "Zeeshan Ullah",
        role: "owner",
        gender: "male",
        email: "zeeshanullah@email.com",
        phone: "+92 123 1234567",
        address: "Togh Sarai, Hangu, KPK",
        dateOfBirth: undefined,
        business_name: "Zeeshan Electronics",
        avatar_url: null,
    }

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

                    <Avatar size={100} color='dark' textSize='extraLarge' />

                    <View className='items-center mt-4 mb-5 gap-1'>
                        <Text className='text-2xl font-semibold'>{defaultUser.name}</Text>
                        <Text className='text-dark-50'>{defaultUser.email}</Text>
                    </View>

                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.editWhite} />}
                        label='Edit Profile'
                        width='w-fit'
                        onPress={() => setIsOpen(true)}
                    />

                </View>

                <View className='flex-1 mt-8 gap-5'>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='User Name' value={defaultUser.username} />
                        <InfoField label='Name' value={defaultUser.name} />
                        <InfoField label='Gender' value={defaultUser.gender ?? "Not Added"} />
                        <InfoField label='Date of Birth' value={defaultUser.dateOfBirth ?? "Not Added"} />
                        <InfoField label='Address' value={defaultUser.address ?? "Not Added"} />
                    </View>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='Phone' value={defaultUser.phone} />
                        <InfoField label='Email' value={defaultUser.email} />
                    </View>
                </View>

            </PaddingWrapper>

            {isOpen && <EditProfileModal visible={isOpen} onClose={() => setIsOpen(false)} />}
        </ScreenWrapper>
    )
}

export default ProfileScreen