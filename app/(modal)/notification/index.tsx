import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import React from 'react'
import { Text } from 'react-native'

const NotificationScreen = () => {
    return (
        <ScreenWrapper
            title='Notifications'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <Text className='text-2xl'>Notification Screen</Text>
        </ScreenWrapper>
    )
}

export default NotificationScreen