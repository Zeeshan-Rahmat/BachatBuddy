import Avatar from '@/src/components/common/Avatar'
import Button from '@/src/components/common/Button'
import IconWrapper from '@/src/components/common/IconWrapper'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import InfoField from '@/src/components/ui/InfoField'
import { ICONS } from '@/src/constants/icons'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import EditBusinessProfile from './edit-business-profile'


const BusinessProfileScreen = () => {

    const [isOpen, setIsOpen] = useState(false)

    const defaultBusinessDetails = {
        username: "@zeeshanullah",
        name: "Zeeshan Electronics",
        email: "zeeshanelectronics@email.com",
        phone: "+92 123 1234567",
        address: "Togh Sarai, Hangu, KPK",
        avatar_url: null,
    }

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

                    <Avatar size={100} color='dark' textSize='extraLarge' />

                    <View className='items-center mt-4 mb-5 gap-1'>
                        <Text className='text-2xl font-semibold'>{defaultBusinessDetails.name}</Text>
                        <Text className='text-dark-50'>{defaultBusinessDetails.email}</Text>
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
                        <InfoField label='User Name' value={defaultBusinessDetails.username} />
                        <InfoField label='Name' value={defaultBusinessDetails.name} />
                        <InfoField label='Address' value={defaultBusinessDetails.address ?? "Not Added"} />
                    </View>
                    <View className='bg-white p-4 rounded-card gap-2'>
                        <InfoField label='Phone' value={defaultBusinessDetails.phone} />
                        <InfoField label='Email' value={defaultBusinessDetails.email} />
                    </View>
                </View>

            </PaddingWrapper>

            <EditBusinessProfile visible={isOpen} onClose={() => setIsOpen(false)} />
        </ScreenWrapper>
    )
}

export default BusinessProfileScreen