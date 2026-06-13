import { ICONS } from '@/src/constants/icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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

function usernameInitials(username: string) {
    const words = username.split(" ");

    return (
        words.length > 1
            ? words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
            : words[0].charAt(0).toUpperCase()
    )
}

const ProfileCard = ({ user = defaultUser, onPress }: ProfileCardProps) => {
    return (
        <View className="flex-row items-center">
            {user?.avatar_url ? (
                <Image
                    source={{ uri: user.avatar_url }}
                    className="w-12 h-12 rounded-full mr-3"
                />
            ) : (
                <View className="w-12 h-12 rounded-full bg-navy-400/10 border border-light-100 items-center justify-center mr-3">
                    <Text className="text-navy-400 font-bold text-lg">
                        {usernameInitials(user.username)}
                    </Text>
                </View>
            )}
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