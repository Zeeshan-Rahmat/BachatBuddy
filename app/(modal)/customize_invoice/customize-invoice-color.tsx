import SectionHeader from '@/src/components/dashboard/SectionHeader';
import { COLORS } from '@/src/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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

    return (
        <View className="flex-1">


            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="bg-white rounded-sm p-4 border border-gray-200 shadow-sm">


                    <View style={{ backgroundColor: selectedColor }} className="h-2 w-full mb-4 rounded-t-xs" />


                    <View className="flex-row items-start justify-between mb-4 border-b border-slate-100 pb-4">
                        <View className="flex-1 pr-2">

                            <Text style={{ color: selectedColor }} className="text-xl font-bold">
                                Zeeshan Electronics
                            </Text>
                            <Text className="text-slate-500 text-xs mt-0.5">Tall Main Road, Togh Sarai, Hangu, KPK</Text>
                            <Text className="text-slate-700 text-xs mt-1 font-medium">
                                Mobile No.: <Text className="text-slate-500">+92 0123 1234567</Text> | Email: <Text className="text-slate-500">zeeshanelectronics@email.com</Text>
                            </Text>
                        </View>
                        <View className="w-12 h-12 rounded-full border border-slate-200 items-center justify-center">
                            <MaterialCommunityIcons name="compass-outline" size={24} color={selectedColor} />
                        </View>
                    </View>


                    <View className="flex-row border-b border-slate-100 pb-3 mb-3">
                        <View className="flex-1 border-r border-slate-100 pr-2">
                            <Text className="text-xs font-bold text-slate-800 mb-0.5">BILL TO</Text>
                            <Text className="text-sm font-bold text-slate-900">Junaid Rehman</Text>
                            <Text className="text-slate-500 text-xs">Kohat, KPK</Text>
                            <Text className="text-slate-500 text-xs mt-0.5">Mobile No.: +92 0123 1234567</Text>
                        </View>
                        <View className="flex-1 pl-3 justify-center">
                            <Text className="text-xs text-slate-700 font-medium">Invoice No.: <Text className="text-slate-900 font-bold">INV2026-2401203015</Text></Text>
                            <Text className="text-xs text-slate-700 font-medium mt-0.5">Invoice Date: <Text className="text-slate-500">01 May, 2026</Text></Text>
                            <Text className="text-xs text-slate-700 font-medium mt-0.5">Due Date: <Text className="text-slate-500">10 May, 2026</Text></Text>
                        </View>
                    </View>


                    <View className="flex-row border-b border-slate-300 pb-1 mb-2">
                        <Text className="text-[11px] font-bold text-slate-800 w-[12%]">S.NO.</Text>
                        <Text className="text-[11px] font-bold text-slate-800 flex-1">ITEMS</Text>
                        <Text className="text-[11px] font-bold text-slate-800 w-[12%] text-center">QTY</Text>
                        <Text className="text-[11px] font-bold text-slate-800 w-[20%] text-right">RATE</Text>
                        <Text className="text-[11px] font-bold text-slate-800 w-[22%] text-right">AMOUNT</Text>
                    </View>


                    <View className="flex-row border-b border-slate-100 pb-2 mb-3">
                        <Text className="text-xs text-slate-700 w-[12%]">1</Text>
                        <Text className="text-xs text-slate-900 font-medium flex-1">Smart Watch Series 5</Text>
                        <Text className="text-xs text-slate-700 w-[12%] text-center">2</Text>
                        <Text className="text-xs text-slate-700 w-[20%] text-right">49,999 PKR</Text>
                        <Text className="text-xs text-slate-900 font-semibold w-[22%] text-right">99,998 PKR</Text>
                    </View>


                    <View className="flex-row justify-between pt-2">
                        <View className="w-[52%] pr-2">
                            <Text className="text-[11px] font-bold text-slate-900 mb-1">Terms and Condition:</Text>
                            <Text className="text-[10px] text-slate-500 leading-4">1. Payment is due at the time of purchase.</Text>
                            <Text className="text-[10px] text-slate-500 leading-4">2. Goods cannot be returned unless defective.</Text>
                        </View>

                        <View className="w-[45%] border-t border-slate-300 pt-1">
                            <View className="flex-row justify-between py-0.5">
                                <Text className="text-xs text-slate-500">DISCOUNT (5%)</Text>
                                <Text className="text-xs text-slate-700">4,998 PKR</Text>
                            </View>
                            <View className="flex-row justify-between border-t border-b border-slate-200 py-1 my-0.5">
                                <Text className="text-xs font-bold text-slate-900">TOTAL AMOUNT</Text>
                                <Text className="text-xs font-bold text-slate-900">95,000 PKR</Text>
                            </View>
                            <View className="flex-row justify-between py-0.5">
                                <Text className="text-xs text-slate-500">Balance Amount</Text>
                                <Text className="text-xs font-bold text-slate-900">95,000 PKR</Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ backgroundColor: selectedColor }} className="h-2 w-full mt-6 rounded-b-xs" />
                </View>
            </ScrollView>


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
