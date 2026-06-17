import { ROUTES } from '@/src/constants/routes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type FontSizeSetting = 'Small' | 'Medium' | 'Large';

export default function CustomizeInvoiceOptionScreen() {
    const [selectedFontSize, setSelectedFontSize] = useState<FontSizeSetting>('Medium');
    const [selectedFontFamily, setSelectedFontFamily] = useState('Arial'); // Spelling match for 'Ariel' placeholder from image

    // Skeleton function to route user to the Signature Pad Canvas screen
    const handleOpenSignaturePad = () => {
        console.log('Navigating to Signature Canvas view...');
        // TODO: router.push('/path-to-your-signature-pad-screen');
        router.push(ROUTES.MODAL.SIGNATURE_PAD)
    };

    // Skeleton function to open Font Picker dropdown modal
    const handleToggleFontDropdown = () => {
        console.log('Opening font family picker menu sheet...');
        // TODO: Implement bottom-sheet list configuration or picker modal
    };

    return (
        <View className="flex-1">

            {/* ==========================================
          SECTION 1: FONT STYLE CONFIGURATIONS
         ========================================== */}
            <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                Font Style
            </Text>

            <View className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm mb-6">

                {/* Font Family Dropdown Trigger Selector */}
                <Text className="text-sm font-bold text-gray-800 mb-2">
                    Font Family
                </Text>

                <TouchableOpacity
                    onPress={handleToggleFontDropdown}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3 bg-white mb-4"
                >
                    <Text className="text-sm font-medium text-gray-700">
                        {selectedFontFamily}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#6b7280" />
                </TouchableOpacity>

                {/* Font Size Segmented Button Selector Row */}
                <Text className="text-sm font-bold text-gray-800 mb-2">
                    Font Size
                </Text>

                <View className="flex-row gap-x-3">
                    {(['Small', 'Medium', 'Large'] as FontSizeSetting[]).map((size) => {
                        const isSelected = selectedFontSize === size;
                        return (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedFontSize(size)}
                                activeOpacity={0.8}
                                className={`flex-1 py-3.5 rounded-lg border items-center justify-center ${isSelected
                                    ? 'bg-emerald-100 border-emerald-200 shadow-xs'
                                    : 'bg-white border-gray-300'
                                    }`}
                            >
                                <Text className={`text-sm font-semibold ${isSelected ? 'text-emerald-700' : 'text-gray-400'
                                    }`}>
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>

            {/* ==========================================
          SECTION 2: INVOICE SIGNATURE SETUP
         ========================================== */}
            <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                Invoice Signature
            </Text>

            <View className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm items-center justify-center min-h-25">

                <TouchableOpacity
                    onPress={handleOpenSignaturePad}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-center border border-emerald-500/30 bg-emerald-50/20 px-5 py-2.5 rounded-lg"
                >
                    <MaterialCommunityIcons name="plus" size={18} color="#10b981" />
                    <Text className="text-emerald-600 text-sm font-bold ml-1">
                        Add Signature and Label
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}