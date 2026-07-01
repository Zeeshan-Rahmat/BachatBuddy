import ImageContainer from '@/src/components/common/ImageContainer';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import type { ApprovalRequest } from '@/src/services/approvalWorkflowService';
import React from 'react';
import { ActivityIndicator, ColorValue, FlatList, Text, TouchableOpacity, View } from 'react-native';

interface RequestsSectionProps {
    requests: ApprovalRequest[];
    loading: boolean;
    activeRequestId: string | null;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onRefresh: () => void;
}

interface RequestCardProps {
    activeRequestId: string | null;
    onAccept: () => void;
    onReject: () => void;
    request: ApprovalRequest;
}

export default function BackupRestoreRequests({
    requests,
    loading,
    activeRequestId,
    onAccept,
    onReject,
    onRefresh,
}: RequestsSectionProps) {
    return (
        <View className="flex-1">
            <SectionHeader title='Approval Requests' marginTop={0} marginBottom={6} hasViewMore={false} fontSize={20} />

            <Text className="text-base text-dark-50 mb-5">
                Review employee changes before they sync into the business cloud data.
            </Text>

            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={onRefresh}
                contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
                ListEmptyComponent={
                    <View className="items-center justify-center pt-20">
                        {loading ? (
                            <ActivityIndicator color={COLORS.primary400} />
                        ) : (
                            <Text className="text-dark-50 text-base font-medium">
                                No approval requests found.
                            </Text>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <RequestCard
                        request={item}
                        activeRequestId={activeRequestId}
                        onAccept={() => onAccept(item.id)}
                        onReject={() => onReject(item.id)}
                    />
                )}
            />
        </View>
    );
}

function RequestCard({ request, activeRequestId, onAccept, onReject }: RequestCardProps) {
    const isLoading = activeRequestId === request.id;
    const image = request.submittedByImage ? { uri: request.submittedByImage } : undefined;

    return (
        <View className="flex-row items-center bg-white p-3 rounded-button">
            <ImageContainer placeholder={ICONS.COMMON.customer} image={image} size={44} />

            <View className="flex-1 pr-2">
                <Text className="text-base font-bold text-dark-300 capitalize" numberOfLines={1}>
                    {request.title}
                </Text>
                <Text className="text-xs text-dark-50 font-medium mt-0.5" numberOfLines={1}>
                    {request.submittedByName} <Text className="text-light-100">|</Text> {request.subtitle}
                </Text>
            </View>

            <View className="flex-row gap-x-2">
                <RequestButton label='Accept' onPress={onAccept} bgColor={COLORS.success} loading={isLoading} />
                <RequestButton label='Reject' onPress={onReject} bgColor={COLORS.danger} loading={isLoading} />
            </View>
        </View>
    );
}

function RequestButton({
    label,
    bgColor,
    loading,
    onPress,
}: {
    label: string;
    bgColor: ColorValue;
    loading: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={loading}
            className="px-4 py-2 rounded-button min-w-16 items-center"
            style={{ backgroundColor: bgColor, opacity: loading ? 0.7 : 1 }}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
                <Text className="text-white text-xs font-semibold">
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}
