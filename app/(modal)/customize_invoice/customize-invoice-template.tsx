import SectionHeader from '@/src/components/dashboard/SectionHeader';
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

    return (

        <View className="flex-1">


            <View className='bg-white p-1 mb-5 rounded-button w-full h-96'>
                <Image
                    source={{ uri: selectedTamplateImage }}
                    className="w-full h-full opacity-60"
                    resizeMode="cover"
                />
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
                                className="w-20 h-28 bg-slate-100 rounded-lg overflow-hidden border border-gray-200 relative"
                            >
                                {/* Simulating the image preview inside the card item */}
                                <Image
                                    source={{ uri: tpl.thumbnail }}
                                    className="w-full h-full opacity-60"
                                    resizeMode="cover"
                                />

                                {/* Active Selection Overlay Gray-Out with Checkmark Checkbox */}
                                {isSelected && (
                                    <View className="absolute inset-0 bg-black/30 items-center justify-center">
                                        <View className="bg-white w-6 h-6 rounded-md items-center justify-center shadow-sm">
                                            <MaterialCommunityIcons name="check" size={16} color="#059669" />
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