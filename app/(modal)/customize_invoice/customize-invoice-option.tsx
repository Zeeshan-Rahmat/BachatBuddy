import ValueSelect from '@/src/components/common/ValueSelect';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { ROUTES } from '@/src/constants/routes';
import { COLORS } from '@/src/constants/theme';
import { buildInvoiceCustomizationPreviewData } from '@/src/services/invoice/invoiceCustomizationPreviewData';
import InvoiceViewer from '@/src/services/invoice/invoiceViewer';
import { useAuthStore } from '@/src/store/authStore';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import type { FontFamily, FontSize } from '@/src/types/invoice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type FontSizeOption = {
    label: string;
    value: FontSize;
};

const FONT_SIZES: FontSizeOption[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
];

const FONT_FAMILIES: FontFamily[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia'];

export default function CustomizeInvoiceOptionScreen() {
    const user = useAuthStore((state) => state.user);
    const invoiceData = useMemo(() => buildInvoiceCustomizationPreviewData(user), [user]);
    const customization = useInvoiceCustomizationStore((state) => state.customization);
    const signature = useInvoiceCustomizationStore((state) => state.signature);
    const setFontFamily = useInvoiceCustomizationStore((state) => state.setFontFamily);
    const setFontSize = useInvoiceCustomizationStore((state) => state.setFontSize);
    const clearSignature = useInvoiceCustomizationStore((state) => state.clearSignature);

    const handleOpenSignaturePad = () => {
        router.push(ROUTES.MODAL.SIGNATURE_PAD)
    };


    return (
        <View className="flex-1">

            <View className='bg-white mb-5 rounded-button w-full h-120'>
                <InvoiceViewer invoiceData={invoiceData} customization={customization} />
            </View>

            <SectionHeader title='FONT STYLE' fontSize={14} marginTop={0} hasViewMore={false} textColor={COLORS.dark50} />

            <View className="bg-white rounded-button p-4 mb-6">

                <SectionHeader title='Font Family' fontSize={13} marginTop={0} hasViewMore={false} textColor={COLORS.dark300} />

                <ValueSelect
                    values={FONT_FAMILIES}
                    value={customization.fontFamily}
                    onChange={(fontFamily) => setFontFamily(fontFamily as FontFamily)}
                    icon={<MaterialCommunityIcons name="format-font" size={24} color={COLORS.placeholder} />}
                />


                <SectionHeader title='Font Size' fontSize={13} marginTop={0} hasViewMore={false} textColor={COLORS.dark300} />

                <View className="flex-row gap-x-3">
                    {FONT_SIZES.map((size) => {
                        const isSelected = customization.fontSize === size.value;
                        return (
                            <TouchableOpacity
                                key={size.value}
                                onPress={() => setFontSize(size.value)}
                                activeOpacity={0.8}
                                className={`flex-1 py-3.5 rounded-button border items-center justify-center will-change-variable ${isSelected
                                    ? 'bg-primary-400/20 border-primary-400/50 shadow-xs'
                                    : 'bg-white border-light-100'
                                    }`}
                            >
                                <Text className={`text-sm font-semibold ${isSelected ? 'text-primary-500' : 'text-dark-50'
                                    }`}>
                                    {size.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>


            <SectionHeader title='INVOICE SIGNATURE' fontSize={14} marginTop={0} hasViewMore={false} textColor={COLORS.dark50} />

            <View className="bg-white justify-center items-center rounded-button p-4 min-h-25">
                {signature ? (
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-1 pr-3">
                                <Text className="text-xs font-semibold text-dark-50 uppercase tracking-wider">
                                    Signature Label
                                </Text>
                                <Text className="text-base font-bold text-dark-300 mt-0.5" numberOfLines={1}>
                                    {signature.label}
                                </Text>
                            </View>

                            <View className="flex-row gap-x-2">
                                <TouchableOpacity
                                    onPress={handleOpenSignaturePad}
                                    activeOpacity={0.7}
                                    className="w-10 h-10 rounded-full bg-primary-400/10 items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="pencil" size={18} color={COLORS.primary500} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={clearSignature}
                                    activeOpacity={0.7}
                                    className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="delete-outline" size={20} color="#e11d48" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="h-28 border border-light-100 rounded-button bg-slate-50 overflow-hidden items-center justify-center">
                            <Image
                                source={{ uri: signature.dataUri }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                ) : (
                    <View className="items-center justify-center">
                        <TouchableOpacity
                            onPress={handleOpenSignaturePad}
                            activeOpacity={0.7}
                            className="flex-row items-center justify-center border border-dashed border-primary-400/30 bg-primary-400/10 px-5 py-2.5 rounded-button"
                        >
                            <MaterialCommunityIcons name="plus" size={18} color={COLORS.primary500} />
                            <Text className="text-primary-500 text-sm font-bold ml-1">
                                Add Signature and Label
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>

        </View>
    );
}
