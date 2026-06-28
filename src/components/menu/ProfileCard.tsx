import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { useAuthStore } from '@/src/store/authStore';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../common/Avatar';
import IconWrapper from '../common/IconWrapper';

interface ProfileCardProps {
    onPress?: () => void;
}

const ProfileCard = ({
    onPress = () => router.push(ROUTES.MODAL.PROFILE)

}: ProfileCardProps) => {
    const user = useAuthStore((state) => state.user);
    const displayName = user?.name || user?.username || 'Profile';
    const displaySubtitle = user?.businessName || user?.email || 'Not signed in';

    return (
        <View className="flex-row items-center gap-3">

            <Avatar
                name={displayName}
                img={user?.img ?? undefined}
                color='dark'
                size={48}
                textSize='large'
                onPress={onPress}
            />

            <View className="flex-1">
                <Text className="text-dark-300 font-bold text-base" numberOfLines={1}>
                    {displayName}
                </Text>
                <Text className="text-dark-50 text-xs" numberOfLines={1}>
                    {displaySubtitle}
                </Text>
            </View>

            {/* Edit profile icon */}
            <TouchableOpacity
                onPress={onPress}
                className="p-1.5"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <IconWrapper name={ICONS.MENU.edit} size={20} />
            </TouchableOpacity>
        </View>
    )
}

export default ProfileCard
