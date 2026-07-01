import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { COLORS } from '@/src/constants/theme';
import { buildInvoiceCustomizationPreviewData } from '@/src/services/invoice/invoiceCustomizationPreviewData';
import InvoiceViewer from '@/src/services/invoice/invoiceViewer';
import { useAuthStore } from '@/src/store/authStore';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Color = {
    id: string;
    hex: string;
}


const INVOICE_COLORS: Color[] = [
    { id: 'purple', hex: '#6B21A8' },
    { id: 'orange', hex: '#F97316' },
    { id: 'cyan', hex: '#0EA5E9' },
    { id: 'pink', hex: '#F43F5E' },
    { id: 'teal', hex: '#14B8A6' },
    { id: 'green', hex: '#22C55E' },
    { id: 'yellow', hex: '#EAB308' },
    { id: 'indigo', hex: '#6366F1' },
    { id: 'brown', hex: '#A16207' },
];

const COLOR_PICKER_SWATCHES: Color[] = [
    { id: 'emerald', hex: '#22C55E' },
    { id: 'lime', hex: '#84CC16' },
    { id: 'amber', hex: '#F59E0B' },
    { id: 'orange', hex: '#F97316' },
    { id: 'rose', hex: '#E11D48' },
    { id: 'pink', hex: '#EC4899' },
    { id: 'violet', hex: '#7C3AED' },
    { id: 'indigo', hex: '#4F46E5' },
    { id: 'blue', hex: '#2563EB' },
    { id: 'sky', hex: '#0284C7' },
    { id: 'cyan', hex: '#06B6D4' },
    { id: 'teal', hex: '#14B8A6' },
    { id: 'slate', hex: '#334155' },
    { id: 'zinc', hex: '#3F3F46' },
    { id: 'stone', hex: '#57534E' },
];

const isValidHexColor = (value: string): boolean => /^#?[0-9a-fA-F]{6}$/.test(value.trim());

const normalizeHexColor = (value: string): string => {
    const cleanValue = value.trim().replace('#', '').toUpperCase();
    return `#${cleanValue}`;
};

export default function CustomizeInvoiceColorsScreen() {
    const user = useAuthStore((state) => state.user);
    const invoiceData = useMemo(() => buildInvoiceCustomizationPreviewData(user), [user]);
    const customization = useInvoiceCustomizationStore((state) => state.customization);
    const setPrimaryColor = useInvoiceCustomizationStore((state) => state.setPrimaryColor);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    return (
        <View className="flex-1">


            <View className='bg-white mb-5 rounded-button w-full h-120'>
                <InvoiceViewer invoiceData={invoiceData} customization={customization} />
            </View>


            <View className="bg-white rounded-button p-4 pb-6">

                <SectionHeader title='OTHER COLORS' marginTop={0} hasViewMore={false} />


                <View className="flex-row flex-wrap gap-x-3.5 gap-y-4 justify-start">
                    {INVOICE_COLORS.map((color) => {
                        const isSelected = customization.primaryColor === color.hex;
                        return <ColorCard key={color.id} color={color} setSelectedColor={setPrimaryColor} isSelected={isSelected} />;
                    })}


                    <TouchableOpacity
                        onPress={() => setIsPickerOpen(true)}
                        activeOpacity={0.7}
                        className="w-[15.5%] h-10 aspect-square rounded-button items-center justify-center border border-dashed border-light-100 bg-light-300"
                    >
                        <MaterialCommunityIcons name="eyedropper" size={20} color={COLORS.placeholder} />
                    </TouchableOpacity>
                </View>
            </View>

            <InvoiceColorPickerModal
                visible={isPickerOpen}
                initialColor={customization.primaryColor}
                onClose={() => setIsPickerOpen(false)}
                onApply={(color) => {
                    setPrimaryColor(color);
                    setIsPickerOpen(false);
                }}
            />

        </View>
    );
}

function ColorCard({ color, isSelected, setSelectedColor }: { color: Color, isSelected: boolean, setSelectedColor: (color: string) => void }) {
    return (
        <TouchableOpacity
            onPress={() => setSelectedColor(color.hex)}
            activeOpacity={0.8}
            style={{ backgroundColor: color.hex }}
            className="w-[15.5%] h-10 aspect-square rounded-button items-center justify-center"
        >

            {isSelected && (
                <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-white/20 w-7 h-7 rounded-button items-center justify-center border border-white/40">
                        <MaterialCommunityIcons name="check" size={16} color="white" />
                    </View>
                </View>
            )}
        </TouchableOpacity>
    )
}

interface InvoiceColorPickerModalProps {
    visible: boolean;
    initialColor: string;
    onClose: () => void;
    onApply: (color: string) => void;
}

function InvoiceColorPickerModal({
    visible,
    initialColor,
    onClose,
    onApply,
}: InvoiceColorPickerModalProps): React.JSX.Element {
    const [draftColor, setDraftColor] = useState(initialColor);
    const isValid = isValidHexColor(draftColor);
    const previewColor = isValid ? normalizeHexColor(draftColor) : initialColor;

    useEffect(() => {
        if (visible) {
            setDraftColor(initialColor);
        }
    }, [initialColor, visible]);

    const handleApply = () => {
        if (!isValid) {
            return;
        }

        onApply(normalizeHexColor(draftColor));
    };

    const handleClose = () => {
        setDraftColor(initialColor);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
            <View className="flex-1 items-center justify-center px-6"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            >
                <View className="w-full bg-white rounded-button p-5">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-dark-300">Choose Color</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            activeOpacity={0.7}
                            className="w-9 h-9 rounded-full bg-light-300 items-center justify-center"
                        >
                            <MaterialCommunityIcons name="close" size={20} color={COLORS.dark300} />
                        </TouchableOpacity>
                    </View>

                    <View className="h-16 rounded-button mb-4 border border-light-100" style={{ backgroundColor: previewColor }} />

                    <Text className="text-xs font-semibold text-dark-50 uppercase mb-2">Color Palette</Text>
                    <View className="flex-row flex-wrap gap-x-3 gap-y-3 mb-5">
                        {COLOR_PICKER_SWATCHES.map((color) => {
                            const isSelected = previewColor === color.hex;

                            return (
                                <TouchableOpacity
                                    key={color.id}
                                    onPress={() => setDraftColor(color.hex)}
                                    activeOpacity={0.8}
                                    className="w-10 h-10 rounded-button items-center justify-center"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {isSelected && <MaterialCommunityIcons name="check" size={18} color="white" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text className="text-xs font-semibold text-dark-50 uppercase mb-2">Hex Color</Text>
                    <TextInput
                        value={draftColor}
                        onChangeText={setDraftColor}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        maxLength={7}
                        placeholder="#22C55E"
                        placeholderTextColor={COLORS.placeholder}
                        className={`h-12 rounded-button border px-4 text-base font-semibold text-dark-300 will-change-variable ${isValid ? 'border-light-100' : 'border-rose-500'}`}
                    />
                    {!isValid && (
                        <Text className="text-xs text-rose-600 mt-1">Enter a valid 6-digit hex color, for example #22C55E.</Text>
                    )}

                    <View className="flex-row gap-x-3 mt-5">
                        <TouchableOpacity
                            onPress={handleClose}
                            activeOpacity={0.8}
                            className="flex-1 h-12 rounded-button bg-light-300 items-center justify-center"
                        >
                            <Text className="text-base font-bold text-dark-300">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleApply}
                            activeOpacity={0.8}
                            disabled={!isValid}
                            className={`flex-1 h-12 rounded-button items-center justify-center will-change-variable ${isValid ? 'bg-primary-400' : 'bg-dark-50'}`}
                        >
                            <Text className="text-base font-bold text-white">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
