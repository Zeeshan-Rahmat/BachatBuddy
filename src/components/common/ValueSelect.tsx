import { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';

interface ValueSelectProps {
    icon: React.ReactNode;
    rightIcon: React.ReactNode;
    values: string[];
    value: string;
    onChange: (val: string) => void;
    error?: string;
}

export default function ValueSelect({ icon, rightIcon, values, value, onChange, error }: ValueSelectProps) {
    const [open, setOpen] = useState(false);

    return (
        <View className="mb-3">
            <TouchableOpacity
                onPress={() => setOpen(true)}
                className={`flex-row items-center rounded-inputBox border border-light-100 px-3 h-14 ${error ? 'border-red-400' : 'border-gray-200'
                    }`}
            >
                {/* Role icon */}
                <View className="mr-3">
                    {icon}
                </View>
                <Text className={`flex-1 text-inputText ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                    {value || 'Select your role'}
                </Text>
                {rightIcon}
            </TouchableOpacity>
            {error && <Text className="text-red-500 text-error mt-1 ml-1">{error}</Text>}

            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity
                    className="flex-1 bg-black/40 justify-center px-10"
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View className="bg-white rounded-card overflow-hidden">
                        <FlatList
                            data={values}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { onChange(item); setOpen(false); }}
                                    className={`px-5 py-4 border-b border-gray-100 ${value === item ? 'bg-green-50' : 'bg-white'
                                        }`}
                                >
                                    <Text className={`text-base ${value === item ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
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