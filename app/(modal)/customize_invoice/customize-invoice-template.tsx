import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { COLORS } from '@/src/constants/theme';
import { buildInvoiceCustomizationPreviewData } from '@/src/services/invoice/invoiceCustomizationPreviewData';
import InvoiceViewer from '@/src/services/invoice/invoiceViewer';
import { useAuthStore } from '@/src/store/authStore';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import type { InvoiceTemplateId } from '@/src/types/invoice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { InvoiceTemplate } from '.';

interface CustomizeInvoiceTemplateScreenProps {
    selectedTemplateId: InvoiceTemplateId;
    templates: InvoiceTemplate[];
    setSelectedTemplateId: (templateId: InvoiceTemplateId) => void;
}

const CustomizeInvoiceTemplateScreen = ({ selectedTemplateId, templates, setSelectedTemplateId }: CustomizeInvoiceTemplateScreenProps) => {

    const user = useAuthStore((state) => state.user);
    const invoiceData = useMemo(() => buildInvoiceCustomizationPreviewData(user), [user]);
    const customization = useInvoiceCustomizationStore((state) => state.customization);

    return (

        <View className="flex-1">


            <View className='bg-white mb-5 rounded-button w-full h-120'>
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
                    {templates.map((tpl) => {
                        const isSelected = selectedTemplateId === tpl.id;
                        return (
                            <TouchableOpacity
                                key={tpl.id}
                                onPress={() => setSelectedTemplateId(tpl.id)}
                                activeOpacity={0.9}
                                className={`w-24 rounded-button border bg-slate-50 p-2 relative ${isSelected ? 'border-primary-400' : 'border-gray-200'}`}
                            >
                                <TemplateThumbnail templateId={tpl.id} color={customization.primaryColor} />
                                <Text className={`text-center text-xs font-semibold mt-2 ${isSelected ? 'text-primary-500' : 'text-dark-100'}`}>
                                    {tpl.name}
                                </Text>

                                {isSelected && (
                                    <View className="absolute right-1.5 top-1.5">
                                        <View className="bg-white w-6 h-6 rounded-full items-center justify-center border border-primary-400">
                                            <MaterialCommunityIcons name="check" size={16} color={COLORS.primaryGreen} />
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

function TemplateThumbnail({ templateId, color }: { templateId: InvoiceTemplateId; color: string }): React.JSX.Element {
    return (
        <View className="w-full bg-white overflow-hidden border border-light-100" style={{ aspectRatio: 8.5 / 11 }}>
            <TemplateHeader templateId={templateId} color={color} />
            <View className="px-2 pt-2 gap-y-1.5">
                <View className="flex-row justify-between">
                    <View className="gap-y-1">
                        <View className="w-8 h-1 rounded-full bg-slate-300" />
                        <View className="w-10 h-1 rounded-full bg-slate-200" />
                    </View>
                    <View className="gap-y-1 items-end">
                        <View className="w-7 h-1 rounded-full bg-slate-300" />
                        <View className="w-9 h-1 rounded-full bg-slate-200" />
                    </View>
                </View>

                <View className="mt-1 border-t" style={{ borderColor: templateId === 'minimal' ? COLORS.border : color }} />

                <View className="gap-y-1">
                    {[0, 1, 2, 3].map((line) => (
                        <View key={line} className="flex-row items-center gap-x-1">
                            <View className="w-2 h-1 rounded-full bg-slate-200" />
                            <View className="flex-1 h-1 rounded-full bg-slate-200" />
                            <View className="w-5 h-1 rounded-full bg-slate-300" />
                        </View>
                    ))}
                </View>

                <View
                    className="mt-1 h-2 rounded-sm"
                    style={{ backgroundColor: templateId === 'bold' ? COLORS.navy800 : `${color}22` }}
                />

                <View className="flex-row justify-between mt-1">
                    <View className="w-8 h-5 rounded-sm bg-slate-100" />
                    <View className="gap-y-1 items-end">
                        <View className="w-9 h-1 rounded-full bg-slate-300" />
                        <View className="w-11 h-1 rounded-full" style={{ backgroundColor: color }} />
                    </View>
                </View>
            </View>
        </View>
    );
}

function TemplateHeader({ templateId, color }: { templateId: InvoiceTemplateId; color: string }): React.JSX.Element {
    if (templateId === 'bold') {
        return (
            <View className="h-8 bg-navy-800 px-2 py-1.5 flex-row items-center gap-x-1.5">
                <View className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                <View className="flex-1 gap-y-1">
                    <View className="w-12 h-1 rounded-full bg-white" />
                    <View className="w-9 h-1 rounded-full bg-white/60" />
                </View>
            </View>
        );
    }

    if (templateId === 'modern') {
        return (
            <View>
                <View className="h-2" style={{ backgroundColor: color }} />
                <View className="h-7 px-2 py-1.5 flex-row items-center gap-x-1.5" style={{ backgroundColor: `${color}18` }}>
                    <View className="w-4 h-4 rounded-full" style={{ backgroundColor: `${color}33`, borderColor: color, borderWidth: 1 }} />
                    <View className="flex-1 gap-y-1">
                        <View className="w-12 h-1 rounded-full" style={{ backgroundColor: color }} />
                        <View className="w-10 h-1 rounded-full bg-slate-300" />
                    </View>
                </View>
            </View>
        );
    }

    if (templateId === 'minimal') {
        return (
            <View className="h-8 px-2 py-1.5 border-b border-light-100 flex-row items-center gap-x-1.5">
                <View className="w-4 h-4 rounded-full border" style={{ borderColor: color }} />
                <View className="flex-1 gap-y-1">
                    <View className="w-12 h-1 rounded-full" style={{ backgroundColor: color }} />
                    <View className="w-10 h-1 rounded-full bg-slate-200" />
                </View>
            </View>
        );
    }

    return (
        <View>
            <View className="h-3 bg-black" />
            <View className="h-1.5" style={{ backgroundColor: color }} />
            <View className="h-7 px-2 py-1.5 flex-row items-center gap-x-1.5">
                <View className="w-4 h-4 rounded-full" style={{ backgroundColor: `${color}22`, borderColor: color, borderWidth: 1 }} />
                <View className="flex-1 gap-y-1">
                    <View className="w-12 h-1 rounded-full" style={{ backgroundColor: color }} />
                    <View className="w-9 h-1 rounded-full bg-slate-300" />
                </View>
            </View>
        </View>
    );
}

export default CustomizeInvoiceTemplateScreen
