import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../common/Avatar';
import IconWrapper from '../common/IconWrapper';

interface ProfileCardProps {
    user?: {
        id: string;
        username: string;
        email: string;
        role: string;
        business_name: string | null;
        avatar_url: string | null
    };
    onPress?: () => void;
}

const defaultUser = {
    id: "ZU1100",
    username: "Zeeshan Ullah",
    email: "zeeshanullah@email.com",
    role: "owner",
    business_name: "Zeeshan Electronics",
    avatar_url: null,
}

const ProfileCard = ({
    user = defaultUser,
    onPress = () => router.navigate(ROUTES.MODAL.PROFILE)

}: ProfileCardProps) => {
    return (
        <View className="flex-row items-center gap-3">

            <Avatar color='dark' size={48} textSize='large' onPress={() => router.navigate(ROUTES.MODAL.PROFILE)} />

            <View className="flex-1">
                <Text className="text-dark-300 font-bold text-base" numberOfLines={1}>
                    {user?.username}
                </Text>
                <Text className="text-dark-50 text-xs" numberOfLines={1}>
                    {user?.email}
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