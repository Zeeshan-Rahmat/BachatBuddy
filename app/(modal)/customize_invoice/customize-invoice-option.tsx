import ValueSelect from '@/src/components/common/ValueSelect';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { ROUTES } from '@/src/constants/routes';
import { COLORS } from '@/src/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type FontSizeSetting = 'Small' | 'Medium' | 'Large';

const FONT_SIZES = ['Small', 'Medium', 'Large'];

const FONT_FAMILIES = ['Arial', 'Times New Roman', 'Calibri']

export default function CustomizeInvoiceOptionScreen() {
    const [selectedFontSize, setSelectedFontSize] = useState<FontSizeSetting>('Medium');
    const [selectedFontFamily, setSelectedFontFamily] = useState(FONT_FAMILIES[0]); // Spelling match for 'Ariel' placeholder from image

    // Skeleton function to route user to the Signature Pad Canvas screen
    const handleOpenSignaturePad = () => {
        console.log('Navigating to Signature Canvas view...');
        // TODO: router.push('/path-to-your-signature-pad-screen');
        router.push(ROUTES.MODAL.SIGNATURE_PAD)
    };


    return (
        <View className="flex-1">

            <SectionHeader title='FONT STYLE' fontSize={14} marginTop={0} hasViewMore={false} textColor={COLORS.dark50} />

            <View className="bg-white rounded-button p-4 mb-6">

                <SectionHeader title='Font Family' fontSize={13} marginTop={0} hasViewMore={false} textColor={COLORS.dark300} />

                <ValueSelect
                    values={FONT_FAMILIES}
                    value={selectedFontFamily}
                    onChange={(fontFamily) => setSelectedFontFamily(fontFamily)}
                    icon={<MaterialCommunityIcons name="format-font" size={24} color={COLORS.placeholder} />}
                />


                <SectionHeader title='Font Size' fontSize={13} marginTop={0} hasViewMore={false} textColor={COLORS.dark300} />

                <View className="flex-row gap-x-3">
                    {(FONT_SIZES as FontSizeSetting[]).map((size) => {
                        const isSelected = selectedFontSize === size;
                        return (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedFontSize(size)}
                                activeOpacity={0.8}
                                className={`flex-1 py-3.5 rounded-button border items-center justify-center ${isSelected
                                    ? 'bg-primary-400/20 border-primary-400/50 shadow-xs'
                                    : 'bg-white border-light-100'
                                    }`}
                            >
                                <Text className={`text-sm font-semibold ${isSelected ? 'text-primary-500' : 'text-dark-50'
                                    }`}>
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>


            <SectionHeader title='INVOICE SIGNATURE' fontSize={14} marginTop={0} hasViewMore={false} textColor={COLORS.dark50} />

            <View className="bg-white rounded-button p-4 items-center justify-center min-h-25">

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

        </View>
    );
}