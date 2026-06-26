import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { COLORS } from '@/src/constants/theme';
import InvoiceViewer from '@/src/services/invoice/invoiceViewer';
import { MOCK_INVOICE_DATA } from '@/src/templates/mockInvoiceData';
import { InvoiceCustomization } from '@/src/types/invoice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { InvoiceTemplate } from '.';

interface CustomizeInvoiceTemplateScreenProps {
    selectedTamplateImage: string;
    selectedTemplateId: string;
    mockData: InvoiceTemplate[];
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string>>;
}

const CustomizeInvoiceTemplateScreen = ({ selectedTamplateImage, selectedTemplateId, mockData, setSelectedTemplateId }: CustomizeInvoiceTemplateScreenProps) => {

    const invoiceData = MOCK_INVOICE_DATA;

    const customization: InvoiceCustomization =
    {
        templateId: 'bold',
        fontFamily: "Arial",
        fontSize: 'medium',
        primaryColor: COLORS.navy400,
        signature: null
    }

    return (

        <View className="flex-1">


            <View className='bg-white p-1 mb-5 rounded-button w-full h-120'>
                <InvoiceViewer invoiceData={invoiceData} customization={customization} />
            </View>


            {/* ==========================================
                3. BOTTOM SELECTION DRAWER ("OTHER TEMPLATES")
               ========================================== */}
            <View className="bg-white rounded-button p-4 pb-6">
                <SectionHeader title='OTHER TEMPLATES' marginTop={0} hasViewMore={false} />

                {/* Horizontal Scrolling Thumbnail Strip */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12 }}
                >
                    {mockData.map((tpl) => {
                        const isSelected = selectedTemplateId === tpl.id;
                        return (
                            <TouchableOpacity
                                key={tpl.id}
                                onPress={() => setSelectedTemplateId(tpl.id)}
                                activeOpacity={0.9}
                                className="w-20 h-28 bg-slate-100 rounded-button overflow-hidden border border-gray-200 relative"
                            >
                                {/* Simulating the image preview inside the card item */}
                                <Image
                                    source={{ uri: tpl.thumbnail }}
                                    className="w-full h-full opacity-60"
                                    resizeMode="cover"
                                />

                                {/* Active Selection Overlay Gray-Out with Checkmark Checkbox */}
                                {isSelected && (
                                    <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                                        <View className="bg-white w-7 h-7 rounded-button items-center justify-center">
                                            <MaterialCommunityIcons name="check" size={20} color={COLORS.primaryGreen} />
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    )
}

export default CustomizeInvoiceTemplateScreen