import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthInputProps extends TextInputProps {
    icon: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    error?: string;
}

interface AuthButtonProps {
    label: string;
    onPress: () => void;
    loading?: boolean;
    leftIcon?: React.ReactNode;
}

interface RoleSelectProps {
    value: string;
    onChange: (val: string) => void;
    error?: string;
}

interface DividerProps {
    label: string;
}

// ─── GradientBackground ───────────────────────────────────────────────────────
// The full-screen green-to-navy gradient used on every auth screen

export function GradientBackground({ children }: { children: React.ReactNode }) {
    return (
        <LinearGradient
            colors={['#22C55E', '#1A7A6E', '#1E3A8A']}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
}

// ─── SuccessBackground ────────────────────────────────────────────────────────
// The dark green-to-navy gradient used on success screens (Email Verified, Password Updated)

export function SuccessBackground({ children }: { children: React.ReactNode }) {
    return (
        <LinearGradient
            colors={['#0D4A2A', '#0A3D35', '#061B2E']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
}

// ─── AuthCard ─────────────────────────────────────────────────────────────────
// The white rounded card that wraps the form content

export function AuthCard({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-white rounded-2xl mx-5 px-6 py-8 shadow-lg">
            {children}
        </View>
    );
}

// ─── SuccessCard ──────────────────────────────────────────────────────────────
// Light grey card used on success/verified screens

export function SuccessCard({ children }: { children: React.ReactNode }) {
    return (
        <View
            className="bg-gray-100 rounded-3xl mx-5 px-8 py-10 items-center"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 5,
                borderWidth: 1,
                borderColor: '#CBD5E1',
            }}
        >
            {children}
        </View>
    );
}

// ─── AuthInput ────────────────────────────────────────────────────────────────
// Reusable input field with left icon, optional right icon, and error message

export function AuthInput({
    icon,
    rightIcon,
    onRightIconPress,
    error,
    ...props
}: AuthInputProps) {
    return (
        <View className="mb-3">
            <View
                className={`flex-row items-center rounded-[5px] border border-light-100 px-3 h-14 ${error ? 'border-red-400' : 'border-gray-200'
                    }`}
            >
                <View className="mr-3">{icon}</View>
                <TextInput
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} className="ml-2 p-1">
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
}

// ─── AuthButton ───────────────────────────────────────────────────────────────
// Full-width green button used across all auth screens

export function AuthButton({ label, onPress, loading, leftIcon }: AuthButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            disabled={loading}
            className="bg-primary-400 rounded-[5px] h-14 flex-row items-center justify-center mt-2"
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                    {leftIcon && <View className="mr-2">{leftIcon}</View>}
                    <Text className="text-white text-base font-bold">{label}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

// ─── RoleSelect ───────────────────────────────────────────────────────────────
// Dropdown to select Owner / Employee role

const ROLES = ['Owner', 'Employee'];

export function RoleSelect({ value, onChange, error }: RoleSelectProps) {
    const [open, setOpen] = useState(false);

    return (
        <View className="mb-3">
            <TouchableOpacity
                onPress={() => setOpen(true)}
                className={`flex-row items-center bg-gray-50 rounded-xl border px-3 h-14 ${error ? 'border-red-400' : 'border-gray-200'
                    }`}
            >
                {/* Role icon */}
                <View className="mr-3">
                    <RoleIcon />
                </View>
                <Text className={`flex-1 text-base ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                    {value || 'Select your role'}
                </Text>
                <ChevronIcon />
            </TouchableOpacity>
            {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}

            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity
                    className="flex-1 bg-black/40 justify-center px-10"
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View className="bg-white rounded-2xl overflow-hidden">
                        <FlatList
                            data={ROLES}
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

// ─── OrDivider ────────────────────────────────────────────────────────────────

export function OrDivider() {
    return (
        <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
        </View>
    );
}

// ─── SuccessCheckIcon ─────────────────────────────────────────────────────────
// Green circle with checkmark — used on Email Verified & Password Updated screens

export function SuccessCheckIcon() {
    return (
        <View
            className="w-20 h-20 rounded-full border-4 border-green-500 items-center justify-center mb-5"
        >
            <Text style={{ fontSize: 36, color: '#22C55E' }}>✓</Text>
        </View>
    );
}

// ─── Inline SVG-like icons (Text-based, no extra deps) ────────────────────────

export const UserIcon = () => (
    <Text style={{ fontSize: 20, color: '#9CA3AF' }}>👤</Text>
);

export const LockIcon = () => (
    <Text style={{ fontSize: 18, color: '#9CA3AF' }}>🔒</Text>
);

export const EmailIcon = () => (
    <Text style={{ fontSize: 18, color: '#9CA3AF' }}>✉️</Text>
);

export const OtpIcon = () => (
    <Text style={{ fontSize: 18, color: '#9CA3AF' }}>🔢</Text>
);

export const EyeIcon = ({ visible }: { visible: boolean }) => (
    <Text style={{ fontSize: 18, color: '#9CA3AF' }}>{visible ? '🙈' : '👁️'}</Text>
);

export const RoleIcon = () => (
    <Text style={{ fontSize: 18, color: '#9CA3AF' }}>👥</Text>
);

export const ChevronIcon = () => (
    <Text style={{ fontSize: 14, color: '#9CA3AF' }}>▼</Text>
);

export const FingerprintIcon = ({ size = 80 }: { size?: number }) => (
    <Text style={{ fontSize: size, lineHeight: size + 10 }}>🫆</Text>
);

export const DashboardIcon = () => (
    <Text style={{ fontSize: 18, color: '#fff' }}>⊞</Text>
);