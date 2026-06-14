import { COLORS } from '@/src/constants/theme';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    type ColorValue,
} from 'react-native';

interface ProfilePickerProps {
    imageUri: string | null;            // Pass the current image URI state from the screen
    onPickImage: () => void;            // Function to launch the Expo/CLI image picker
    icon: React.ReactNode;              // Icon shown when not selected/focused
    activeIcon?: React.ReactNode;        // Icon shown when selected/focused
    rightIcon?: React.ReactNode;         // Action icon (like an edit or camera icon)
    activeRightIcon?: React.ReactNode;   // Action icon when selected
    error?: string;
    flex?: number | undefined;
    bgColor?: ColorValue | undefined;
}

export default function ProfilePicker({
    imageUri,
    onPickImage,
    icon,
    rightIcon,
    activeIcon,
    activeRightIcon,
    error,
    flex,
    bgColor,
}: ProfilePickerProps) {

    // Simulating focus styling when a user interacts or has an image selected
    const hasImage = !!imageUri;

    return (
        <View className="mb-4" style={{ flex: flex, backgroundColor: bgColor }}>
            <View
                className={`flex-row items-center rounded-inputBox border border-light-100 px-3 h-25 
                    ${error ? 'border-red-400' : ''}
                    ${hasImage ? 'border-primary-400' : ''}`}
            >
                {/* Left Icon Area */}
                <View className="mr-3">
                    {hasImage ? (activeIcon || icon) : icon}
                </View>

                {/* Main Content Area (Clickable Row) */}
                <TouchableOpacity
                    onPress={onPickImage}
                    className="flex-1 flex-row items-center h-full"
                    activeOpacity={0.7}
                >
                    {imageUri ? (
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: imageUri }}
                                className="w-14 h-14 rounded-full mr-3 bg-gray-200"
                            />
                            <Text className="text-black text-base">Image Selected</Text>
                        </View>
                    ) : (
                        <Text style={{ color: COLORS.placeholder }} className="text-base">
                            Select Profile Picture
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Right Icon Action Area */}
                {rightIcon && (
                    <TouchableOpacity onPress={onPickImage} className="ml-2 p-1">
                        {hasImage ? (activeRightIcon || rightIcon) : rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {/* Error Message */}
            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
}
