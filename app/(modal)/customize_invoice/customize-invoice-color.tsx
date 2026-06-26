import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { COLORS } from '@/src/constants/theme';
import InvoiceViewer from '@/src/services/invoice/invoiceViewer';
import { MOCK_INVOICE_DATA } from '@/src/templates/mockInvoiceData';
import { InvoiceCustomization } from '@/src/types/invoice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

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

export default function CustomizeInvoiceColorsScreen() {
    const [selectedColor, setSelectedColor] = useState('#6B21A8');

    const invoiceData = MOCK_INVOICE_DATA;

    const customization: InvoiceCustomization =
    {
        templateId: 'bold',
        fontFamily: "Arial",
        fontSize: 'medium',
        primaryColor: selectedColor,
        signature: null
    }

    return (
        <View className="flex-1">


            <View className='bg-white p-1 mb-5 rounded-button w-full h-120'>
                <InvoiceViewer invoiceData={invoiceData} customization={customization} />
            </View>


            <View className="bg-white rounded-button p-4 pb-6">

                <SectionHeader title='OTHER COLORS' marginTop={0} hasViewMore={false} />


                <View className="flex-row flex-wrap gap-x-3.5 gap-y-4 justify-start">
                    {INVOICE_COLORS.map((color) => {
                        const isSelected = selectedColor === color.hex;
                        return (
                            <ColorCard key={color.id} color={color} setSelectedColor={setSelectedColor} isSelected={isSelected} />
                        );
                    })}


                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="w-[15.5%] h-10 aspect-square rounded-button items-center justify-center border border-dashed border-light-100 bg-light-300"
                    >
                        <MaterialCommunityIcons name="eyedropper" size={20} color={COLORS.placeholder} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

function ColorCard({ color, isSelected, setSelectedColor }: { color: Color, isSelected: boolean, setSelectedColor: React.Dispatch<React.SetStateAction<string>> }) {
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
