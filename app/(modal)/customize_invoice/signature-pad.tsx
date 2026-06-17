import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignaturePadScreen() {
    const [label, setLabel] = useState('');

    // Skeletons for your business logic
    const handleUploadImage = () => {
        console.log('Open image picker for signature upload...');
        // TODO: Implement expo-image-picker logic
    };

    const handleCancel = () => {
        console.log('Cancel pressed, navigate back...');
        // TODO: navigation.goBack() or router.back()
        router.back()
    };

    const handleAddSignature = () => {
        console.log('Saving signature data with label:', label);
        // TODO: Capture drawing canvas ref or file URI and save to local state/DB
    };

    return (
        <ScreenWrapper
            title='Signature Pad'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>

                <View className="flex-1">
                    <ScrollView
                        className="flex-1 "
                        contentContainerStyle={{ paddingBottom: 30 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* ==========================================
            SECTION 1: LABEL INPUT FIELD
           ========================================== */}
                        <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                            Label
                        </Text>

                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 mb-6 shadow-sm">
                            <MaterialCommunityIcons name="tag" size={20} color="#9ca3af" className="mr-2" />
                            <TextInput
                                className="flex-1 text-sm text-gray-800 py-2 h-10"
                                placeholder="Enter signature label"
                                placeholderTextColor="#9ca3af"
                                value={label}
                                onChangeText={setLabel}
                            />
                        </View>

                        {/* ==========================================
            SECTION 2: SIGNATURE PAD CANVAS CONTAINER
           ========================================== */}
                        <Text className="text-xs font-bold text-gray-500 tracking-wider mb-0.5 uppercase">
                            Signature
                        </Text>
                        <Text className="text-[11px] text-gray-500 mb-2">
                            (You can draw on this signature pad or upload your signature)
                        </Text>

                        {/* White Canvas Frame */}
                        <View className="bg-white border border-gray-200 rounded-lg aspect-3/4 p-4 justify-between shadow-sm relative">

                            {/* Workspace for drawing placement */}
                            <View className="flex-1 w-full items-center justify-center">
                                {/* 
              TODO: Place your signature drawing component here.
              Example: <SignatureScreen ref={canvasRef} onEnd={handleDrawEnd} />
            */}
                            </View>

                            {/* Floating Upload Button at Bottom Left */}
                            <TouchableOpacity
                                onPress={handleUploadImage}
                                activeOpacity={0.8}
                                className="flex-row items-center bg-slate-400/90 px-4 py-2.5 rounded-md self-start shadow-xs"
                            >
                                <MaterialCommunityIcons name="download" size={16} color="white" />
                                <Text className="text-white text-xs font-bold ml-1 uppercase tracking-wider">
                                    Upload
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                    {/* ==========================================
          SECTION 3: BOTTOM ACTIONS FIXED BAR
         ========================================== */}
                    <View className="flex-row border-t border-gray-200/60 bg-slate-100 p-4 gap-x-3">
                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={handleCancel}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-center bg-gray-300/80 py-3.5 rounded-lg"
                        >
                            <MaterialCommunityIcons name="chevron-left" size={20} color="#1f2937" />
                            <Text className="text-gray-800 text-sm font-bold uppercase tracking-wider ml-0.5">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Add/Save Button */}
                        <TouchableOpacity
                            onPress={handleAddSignature}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-center bg-emerald-500 py-3.5 rounded-lg"
                        >
                            <MaterialCommunityIcons name="plus" size={18} color="white" />
                            <Text className="text-white text-sm font-bold uppercase tracking-wider ml-1">
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </PaddingWrapper>
        </ScreenWrapper>
    );
}