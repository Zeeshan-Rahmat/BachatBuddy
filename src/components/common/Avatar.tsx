import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface AvatarProps {
    user?: {
        id: string;
        username: string;
        email: string;
        role: string;
        business_name: string | null;
        avatar_url: string | null
    };
    size?: number;
    color?: "dark" | "light";
    textSize?: "extraLarge" | "large" | "small";
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

const Avatar = ({ user = defaultUser, size = 36, color = "light", textSize = "small", onPress }: AvatarProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            {user?.avatar_url ? (
                <Image
                    source={{ uri: user.avatar_url }}
                    className={`rounded-full border ${color == "light" ? "border-white" : "border-light-100"}`}
                    style={{ width: size, height: size }}
                />
            ) : (
                <View
                    className={
                        `rounded-full border items-center justify-center 
                        ${color == "light" ? "bg-white/20 border-white" : "bg-navy-400/20 border-light-100"}`
                    }
                    style={{ width: size, height: size }}
                >
                    <Text className={
                        `font-bold tracking-wider
                        ${textSize == "small" ? "text-sm" : textSize == "large" ? "text-lg" : "text-3xl"}
                        ${color == "light" ? "text-white" : "text-navy-400"}`
                    }
                    >
                        {usernameInitials(user.username)}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    )
}

export default Avatar