import ImageContainer from '@/src/components/common/ImageContainer';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import React from 'react';
import { ColorValue, FlatList, type ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

type RequestType = 'Backup' | 'Restore' | 'Stock Update' | 'Invoice Update' | 'Customer Update' | 'Supplier Update';

interface RequestsSectionProps {
    onAccept: (id: string, type: RequestType) => void;
    onReject: (id: string, type: RequestType) => void;
}

interface RequestCardProps {
    onAccept: () => void;
    onReject: () => void;
    request: RequestItem;
}

export interface RequestItem {
    id: string;
    type: RequestType;
    userName: string;
    time: string;
    userImage?: ImageSourcePropType | undefined; // URL or local asset path
}

const MOCK_REQUESTS: RequestItem[] = [
    {
        id: 'req_1',
        type: 'Backup',
        userName: 'Muhammad Mubashir',
        time: 'Today',
        // Example placeholder image url
        userImage: undefined,
    },
    {
        id: 'req_2',
        type: 'Restore',
        userName: 'Zafar Iqbal',
        time: '2d',
        userImage: undefined,
    },
    {
        id: 'req_3',
        type: 'Stock Update',
        userName: 'Qamar Ahmad',
        time: '3d',
        userImage: undefined,
    },
    {
        id: 'req_4',
        type: 'Supplier Update',
        userName: 'Zohib Hassan',
        time: '4d',
        userImage: undefined,
    },
    {
        id: 'req_5',
        type: 'Invoice Update',
        userName: 'Said Ahmad',
        time: '7d',
        userImage: undefined,
    },
    {
        id: 'req_6',
        type: 'Customer Update',
        userName: 'Muhammad Sufyan',
        time: '10d',
        userImage: undefined,
    },
];

export default function BackupRestoreRequests({ onAccept, onReject }: RequestsSectionProps) {

    // Fallback UI if no requests are pending
    if (MOCK_REQUESTS.length === 0) return null;

    return (
        <View className="flex-1">

            <SectionHeader title='Backup and Restore Requests' marginTop={0} marginBottom={6} hasViewMore={false} fontSize={20} />

            <Text className="text-base text-dark-50 mb-5">
                Click on <Text className="font-bold text-dark-200">Accept</Text> to approve and <Text className="font-bold text-dark-200">Reject</Text> to disapprove.
            </Text>

            {/* Request Cards Grid Loop */}
            <FlatList
                data={MOCK_REQUESTS} keyExtractor={i => i.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}

                renderItem={({ item }) => (
                    <RequestCard
                        request={item}
                        onAccept={() => onAccept(item.id, item.type)}
                        onReject={() => onReject(item.id, item.type)}
                    />
                )}
            />
        </View>
    );
}



function RequestCard({ request, onAccept, onReject }: RequestCardProps) {
    return (
        <View
            key={request.id}
            className="flex-row items-center bg-white p-3 rounded-button"
        >

            <ImageContainer placeholder={ICONS.COMMON.customer} image={request.userImage} size={44} />


            <View className="flex-1 pr-2">
                <Text className="text-base font-bold text-dark-300" numberOfLines={1}>
                    {request.type} Request
                </Text>
                <Text className="text-xs text-dark-50 font-medium mt-0.5" numberOfLines={1}>
                    {request.userName} <Text className="text-light-100">|</Text> {request.time}
                </Text>
            </View>


            <View className="flex-row gap-x-2">
                <RequestButton label='Accept' onPress={onAccept} bgColor={COLORS.success} />
                <RequestButton label='Reject' onPress={onReject} bgColor={COLORS.danger} />
            </View>

        </View>
    )
}

function RequestButton({ label, bgColor, onPress }: { label: string, bgColor: ColorValue, onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="px-4 py-2 rounded-button"
            style={{ backgroundColor: bgColor }}
        >
            <Text className="text-white text-xs font-semibold">
                {label}
            </Text>
        </TouchableOpacity>
    )
}