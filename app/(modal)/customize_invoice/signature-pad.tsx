import InputText from '@/src/components/common/InputText';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import { COLORS } from '@/src/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
// Import the native drawing engine
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';

export default function SignaturePadScreen() {
    const [signatureLabel, setSignatureLabel] = useState('');
    const signatureRef = useRef<SignatureViewRef>(null);

    // 1. Triggered when user finishes a stroke or taps Add
    const handleOK = (signatureBase64: string) => {
        console.log('Signature captured successfully!');
        console.log('Data Base64 URI:', signatureBase64.substring(0, 50) + '...');

        if (!signatureLabel.trim()) {
            Alert.alert('Label Required', 'Please provide a signature label (e.g., Manager Sign) before saving.');
            return;
        }

        // TODO: Pass { signatureBase64, label: signatureLabel } back to your invoice preview state layout
        Alert.alert('Saved', `Signature "${signatureLabel}" attached successfully!`);
    };

    // 2. Clear canvas data
    const handleClear = () => {
        signatureRef.current?.clearSignature();
    };

    const handleSaveTrigger = () => {
        signatureRef.current?.readSignature();
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

                <View className="flex-1 justify-between">

                    {/* Top Form Group Section */}
                    <View className="flex-1">

                        {/* LABEL INPUT FIELD */}
                        <Text className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                            Label
                        </Text>

                        <InputText
                            icon={<MaterialCommunityIcons name="tag" size={24} color={COLORS.placeholder} />}
                            activeIcon={<MaterialCommunityIcons name="tag" size={24} color={COLORS.primaryGreen} />}
                            value={signatureLabel}
                            onChangeText={setSignatureLabel}
                            placeholder="Enter signature label (e.g. Owner Sign)"
                            placeholderTextColor={COLORS.placeholder}
                            bgColor={COLORS.white}
                        />

                        {/* SIGNATURE CANVAS CONTAINER */}
                        <Text className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-0.5">
                            Signature
                        </Text>
                        <Text className="text-xs text-gray-400 mb-3">
                            (You can draw on this signature pad or upload your signature)
                        </Text>

                        {/* Interactive WebView Canvas Window Wrapper */}
                        <View className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden relative shadow-xs min-h-80">
                            <SignatureScreen
                                ref={signatureRef}
                                onOK={handleOK}
                                autoClear={false}
                                descriptionText=""
                                clearText="Clear"
                                confirmText="Confirm"
                                webStyle={`
              .m-signature-pad { box-shadow: none; border: none; background-color: #ffffff; }
              .m-signature-pad--footer { display: none; margin: 0; }
              body, html { background-color: #ffffff; }
            `}
                            />
                        </View>
                    </View>

                    {/* ==========================================
          BOTTOM REGULAR BUTTON CONTROLS
         ========================================== */}
                    <View className="flex-row gap-x-4 pt-4 bg-slate-100">

                        {/* Clear/Cancel Action Button */}
                        <TouchableOpacity
                            onPress={handleClear}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-center bg-gray-200 py-3.5 rounded-xl border border-gray-300/40"
                        >
                            <MaterialCommunityIcons name="eraser" size={18} color="#1f2937" />
                            <Text className="text-gray-800 text-base font-bold uppercase tracking-wider ml-1.5">
                                Clear Pad
                            </Text>
                        </TouchableOpacity>

                        {/* Save/Add Action Button */}
                        <TouchableOpacity
                            onPress={handleSaveTrigger}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-center bg-emerald-500 py-3.5 rounded-xl shadow-sm"
                        >
                            <MaterialCommunityIcons name="plus" size={20} color="white" />
                            <Text className="text-white text-base font-bold uppercase tracking-wider ml-1">
                                Add
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </PaddingWrapper>
        </ScreenWrapper>
    );
}