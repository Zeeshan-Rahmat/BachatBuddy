import { ICONS } from '@/src/constants/icons';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import IconWrapper from '../common/IconWrapper';

interface ReportValueSelectProps {
    values: string[];
    value: string;
    onChange: (val: string) => void;
}

export default function ReportValueSelect({ values, value, onChange }: ReportValueSelectProps) {
    const [open, setOpen] = useState(false);

    return (
        <View>

            <TouchableOpacity
                onPress={() => setOpen(true)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between border border-light-100 bg-white rounded-button px-3 py-1.5 min-w-25"
            >
                <Text className="text-sm font-medium text-dark-100 mr-1.5">
                    {value}
                </Text>


                <IconWrapper name={ICONS.AUTH.dropdown} size={14} />
            </TouchableOpacity>


            <Modal visible={open} animationType="fade" transparent>
                <TouchableOpacity
                    className="flex-1 justify-center px-16"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        <FlatList
                            data={values}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                    className={`px-5 py-3.5 border-b border-gray-100 ${value === item ? 'bg-emerald-50' : 'bg-white'
                                        }`}
                                >
                                    <Text
                                        className={`text-sm ${value === item ? 'text-emerald-600 font-bold' : 'text-gray-600 font-medium'
                                            }`}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                </TouchableOpacity>
            </Modal>
        </View>
    );
}