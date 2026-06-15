import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// Assuming you use react-native-vector-icons, lucide-react-native, or expo-vector-icons
// If you use something else, swap these icons out accordingly!
import CustomeBottomModal from '@/src/components/modal/CustomeBottomModal';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface NotificationOptionsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAction: (actionType: string) => void;
}

const NotificationOptionsModal = ({ isVisible, onClose, onAction }: NotificationOptionsModalProps) => {

    // Array layout mimicking your menu list structure and icons exactly
    const MENU_ITEMS = [
        {
            id: 'clear_read',
            label: 'Clear all read notification',
            icon: 'bell-off-outline' as const,
        },
        {
            id: 'clear_all',
            label: 'Clear all notification',
            icon: 'bell-remove' as const,
        },
        {
            id: 'mark_read',
            label: 'Mark all notification read',
            icon: 'bell-check-outline' as const,
        },
        {
            id: 'delete_read',
            label: 'Delete all read notification',
            icon: 'trash-can-outline' as const,
        },
        {
            id: 'delete_all',
            label: 'Delete all notification',
            icon: 'trash-can' as const,
        },
    ];

    return (
        <CustomeBottomModal isVisible={isVisible} onClose={onClose}>
            <View className="gap-y-2">
                {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            onAction(item.id);
                            onClose(); // Automatically close modal after selection
                        }}
                        activeOpacity={0.7}
                        className="flex-row items-center bg-white py-4 px-4 rounded-button"
                    >
                        {/* Icon Wrapper */}
                        <View className="mr-4 w-6 items-center">
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={22}
                                color="#0f172a" // Slate-900 matching your text color
                            />
                        </View>

                        {/* Label Text */}
                        <Text className="font-semibold text-slate-900 flex-1">
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </CustomeBottomModal>
    )
}

export default NotificationOptionsModal