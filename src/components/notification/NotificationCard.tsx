import { ICONS } from '@/src/constants/icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ImageContainer from '../common/ImageContainer';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    category: 'Sales' | 'Stock' | 'Payments' | 'Customers'; // Categorized for filtering
    image?: any; // Replace with your image source type if local or URI string
    status: "read" | "unread";
}

const NotificationCard = ({ item }: { item: NotificationItem }) => {
    const [show, setShow] = useState(false)

    return (
        <TouchableOpacity
            onPress={() => setShow(!show)}
            activeOpacity={0.7}
            className={`flex-row items-start p-4 rounded-button ${item.status == "read" ? "border border-light-100" : "bg-white"}`}
        >
            {/* Left Column: Image/Icon Container */}
            <ImageContainer placeholder={ICONS.COMMON.product} size={45} iconSize={25} />

            {/* Right Column: Text Content Metadata */}
            <View className="flex-1">
                <View className="flex-row justify-between items-baseline mb-1">
                    <Text className="text-base font-semibold text-slate-900 flex-1 pr-2" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text className="text-xs text-gray-400 font-medium">
                        {item.time}
                    </Text>
                </View>
                <Text className="text-sm text-gray-600 leading-5" numberOfLines={show ? 2 : 1}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationCard