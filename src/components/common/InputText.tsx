import { COLORS } from '@/src/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type ColorValue,
    type TextInputProps,
} from 'react-native';

interface InputTextProps extends TextInputProps {
    icon: React.ReactNode;
    rightIcon?: React.ReactNode;
    activeIcon?: React.ReactNode;
    activeRightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    error?: string;
    flex?: number | undefined;
    bgColor?: ColorValue | undefined;
}

export default function InputText({
    icon,
    rightIcon,
    activeIcon,
    activeRightIcon,
    onRightIconPress,
    error,
    flex,
    bgColor,
    value,
    placeholder, // Destructured directly from TextInputProps
    ...props
}: InputTextProps) {
    const [isFocused, setIsFocused] = useState(false);

    // Core animation state tracker
    const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Controls the smooth scale transition of the placeholder label text
    useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: (isFocused || value) ? 1 : 0,
            duration: 100,
            useNativeDriver: false, // Animating top, fontSize, left properties
        }).start();
    }, [isFocused, value]);

    // Interpolations for shifting position and resizing text
    const labelTop = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [14, -10], // Shifts up onto the border line
    });

    const labelFontSize = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12], // Shrinks down gracefully
    });

    const labelLeft = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [36, 12], // Adjusts horizontally to clear your left custom icons area
    });

    // Determines label color states matching the error/focus flags
    const getLabelColor = () => {
        if (error) return COLORS.danger; // Red error text
        if (isFocused) return COLORS.primary400; // Primary active theme color (Change this hex to match your theme)
        return COLORS.placeholder;
    };

    return (
        <View className="mb-4" style={{ flex: flex }}>
            <View
                style={{ backgroundColor: bgColor }}
                className={`flex-row items-center rounded-inputBox border border-light-100 px-3 h-14 relative ${error ? 'border-red-500' : ''
                    } ${isFocused ? 'border-primary-400' : ''}`}
            >
                {/* Left Side Custom Component Icon */}
                <View className="mr-3 z-10">
                    {isFocused ? activeIcon : icon}
                </View>

                {/* Floating Placeholder */}
                {placeholder && (
                    <Animated.View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            left: labelLeft,
                            top: labelTop,
                            backgroundColor: bgColor || '#ffffff', // Cuts the border line cleanly
                            paddingHorizontal: 4,
                            borderRadius: 5,
                            zIndex: 10,
                        }}
                    >
                        <Animated.Text
                            style={{
                                fontSize: labelFontSize,
                                color: getLabelColor(),
                                fontWeight: '500',
                            }}
                        >
                            {placeholder}
                        </Animated.Text>
                    </Animated.View>
                )}

                {/* Core Native Form Control Input Area */}
                <TextInput
                    className="flex-1 text-black text-base outline-none pt-3.5"
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                    placeholder="" // Hidden natively because our Animated.Text is handling it
                    {...props}
                />

                {/* Right Side Operation Component Button Trigger */}
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} className="ml-2 p-1 z-10">
                        {isFocused ? activeRightIcon : rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {/* Error Message Layout Output Display */}
            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text>
            )}
        </View>
    );
}