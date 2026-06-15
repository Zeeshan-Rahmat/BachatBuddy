import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import NotificationCard from '@/src/components/notification/NotificationCard';
import TabBar from '@/src/components/notification/TabBar';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import NotificationOptionsModal from './notification-options-model';

// 1. Define Types for your Notification Item
interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    category: 'Sales' | 'Stock' | 'Payments' | 'Customers'; // Categorized for filtering
    image?: any; // Replace with your image source type if local or URI string
    status: "read" | "unread";
}

// 2. Mock Data matching the visuals in "Notification Screen.jpeg"
const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: '1',
        title: 'Low Stock Alert',
        description: 'USB-C Charging Cable stock is below minimum level.',
        time: 'Today',
        category: 'Stock',
        status: "unread",
    },
    {
        id: '2',
        title: 'New Product Added',
        description: 'Laptop Stand Aluminum has been added by Qamar Ahmad.',
        time: 'Yesterday',
        category: 'Stock',
        status: "read",
    },
    {
        id: '3',
        title: 'New Sale Recorded',
        description: 'Invoice #1025 worth Rs. 12,500 has been added by Zafar Iqbal.',
        time: '2d',
        category: 'Sales',
        status: "unread",
    },
    {
        id: '4',
        title: 'New Customer Added',
        description: 'Ahmad Usman has been added by Muhammad Mubashir.',
        time: '2d',
        category: 'Customers',
        status: "read",
    },
    {
        id: '5',
        title: 'Overdue Invoice',
        description: 'Invoice #180 payment is overdue by 5 days.',
        time: '5d',
        category: 'Payments',
        status: "unread",
    },
    {
        id: '6',
        title: 'Stock Refilled',
        description: '20 new units of Laptop Stand Aluminum has been added by ...',
        time: '7d',
        category: 'Stock',
        status: "read",
    },
];

const TABS = ['All', 'Sales', 'Stock', 'Payments'];

const NotificationScreen = () => {

    const [selectedTab, setSelectedTab] = useState<string>('All');

    // 1. Control modal state
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    // 2. Handle button action clicks
    const handleMoreAction = (actionType: string) => {
        console.log("User triggered action: ", actionType);
        // Execute clearing or deleting logic here based on actionType
    };

    // Filter notifications based on selected pill tab
    const filteredNotifications = MOCK_NOTIFICATIONS.filter((item) => {
        if (selectedTab === 'All') return true;
        return item.category === selectedTab;
    });


    return (
        <ScreenWrapper
            title='Notifications'
            leftIcon='back'
            rightIcons='more'
            onMorePress={() => setIsMoreOpen(true)}
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>
                <View className="flex-1 gap-7">

                    {/* 1. Horizontal Scrollable Category Filter Pills */}
                    <TabBar tabs={TABS} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

                    {/* 2. Main Notification Feed List */}
                    <FlatList
                        data={filteredNotifications}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <NotificationCard item={item} />}
                        contentContainerStyle={{ paddingBottom: 24, gap: 12, }}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center pt-20">
                                <Text className="text-dark-50 text-base font-medium">
                                    No notifications found in {selectedTab}
                                </Text>
                            </View>
                        }
                    />
                </View>
            </PaddingWrapper>

            <NotificationOptionsModal
                isVisible={isMoreOpen}
                onClose={() => setIsMoreOpen(false)}
                onAction={handleMoreAction}
            />
        </ScreenWrapper>
    )
}

export default NotificationScreen