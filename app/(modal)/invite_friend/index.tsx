import Button from '@/src/components/common/Button';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import { COLORS } from '@/src/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Alert, Share, View } from 'react-native';

const InviteFriendScreen = () => {

    const handleInviteShare = async () => {
        try {
            const result = await Share.share({
                // The message body that gets pasted into WhatsApp, SMS, Emails, etc.
                message: 'Hey! Join me on BachatBuddy to manage and track your expenses easily. Download the app now: https://bachatbuddy.com/download',
                // Optional Title (mainly used for emails or specific Android native shares)
                title: 'Invite to BachatBuddy',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared successfully via a specific activity type (Mostly iOS specific tracking)
                    console.log(`Shared via: ${result.activityType}`);
                } else {
                    // Shared successfully
                    console.log('Content shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                // User dismissed/canceled the native sharing sheet
                console.log('Share dismissed');
            }
        } catch (error: any) {
            Alert.alert('Error', 'Could not open share panel. Please try again.');
            console.error(error.message);
        }
    };

    return (
        <ScreenWrapper
            title='Invite a Friend'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>

                <View className="flex-1 items-center justify-center">

                    <View className="w-30 h-30 bg-primary-400/10 rounded-full items-center justify-center mb-6">
                        <MaterialCommunityIcons name="gift-outline" size={45} color={COLORS.primaryGreen} />
                    </View>


                    <Title text='Invite a Friend' className='mb-3' />


                    <Subtitle
                        className='mb-5'
                        text='Share BachatBuddy with your friends and help them take control of their daily expense budget tracking!'
                    />


                    <Button
                        label='Share Invite Link'
                        onPress={handleInviteShare}
                        leftIcon={<MaterialCommunityIcons name="share-variant" size={24} color="white" />}
                    />

                </View>

            </PaddingWrapper>
        </ScreenWrapper>
    )
}

export default InviteFriendScreen