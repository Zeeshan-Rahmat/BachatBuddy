import { COLORS } from '@/src/constants/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Text, TouchableOpacity, View, type ColorValue } from 'react-native';

interface DateInputProps {
    date: Date | undefined;
    onDateChange: (date: Date) => void;
    placeholder?: string;
    icon: React.ReactNode;
    rightIcon?: React.ReactNode;
    activeIcon?: React.ReactNode;
    activeRightIcon?: React.ReactNode;
    error?: string;
    flex?: number;
    bgColor?: ColorValue;
}

export default function DateInput({
    date,
    onDateChange,
    placeholder = "Select date",
    icon,
    rightIcon,
    activeIcon,
    activeRightIcon,
    error,
    flex,
    bgColor,
}: DateInputProps) {
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // Android closes on selection, iOS keeps modal view open
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

    const formatDate = (dateToFormat: Date | undefined) => {
        if (!dateToFormat) return undefined;
        return dateToFormat.toISOString().split('T')[0];
    };

    return (
        <View className="mb-4" style={{ flex: flex, backgroundColor: bgColor }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowPicker(true)}
                className={`flex-row items-center rounded-inputBox border border-light-100 px-3 h-14 ${error ? 'border-red-400' : ''
                    } ${showPicker ? 'border-primary-400' : ''}`}
            >
                <View className="mr-3">{showPicker ? activeIcon : icon}</View>
                <Text className="flex-1 text-base" style={{ color: date ? '#000000' : COLORS.placeholder }}>
                    {formatDate(date) || placeholder}
                </Text>
                {rightIcon && (
                    <View className="ml-2 p-1">{showPicker ? activeRightIcon : rightIcon}</View>
                )}
            </TouchableOpacity>

            {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}

            {showPicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                />
            )}
        </View>
    );
}
