import {
    FingerprintIcon,
    GradientBackground,
    OrDivider
} from '@components/auth/AuthComponents';

import InputText from '@/src/components/common/InputText';
import ValueSelect from '@/src/components/common/ValueSelect';
import Button from '@components/common/Button';
import IconWrapper from '@components/common/IconWrapper';
import Wrapper from '@components/common/Wrapper';

import { ICONS } from '@/src/constants/icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const ROLES = ['Owner', 'Employee'];

    const handleSignIn = async () => {
        setLoading(true);
        // TODO: connect to your Node.js/Express API
        // const response = await authService.signIn({ username, role, password });
        setTimeout(() => {
            setLoading(false);
            router.replace('/(app)/dashboard');
        }, 1000);
    };

    return (
        <GradientBackground>
            <View className="flex-1 justify-center px-0">
                <Wrapper>

                    {/* Title */}
                    <Text className="text-3xl font-bold text-gray-900 text-center mb-7">
                        Sign In
                    </Text>

                    {/* Username */}
                    <InputText
                        icon={<IconWrapper name={ICONS.user} />}
                        activeIcon={<IconWrapper name={ICONS.activeUser} />}
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                    />

                    {/* Role Dropdown */}
                    <ValueSelect icon={<IconWrapper name={ICONS.role} />} rightIcon={<IconWrapper name={ICONS.dropdown} />} values={ROLES} value={role} onChange={setRole} />

                    {/* Password */}
                    <InputText
                        icon={<IconWrapper name={ICONS.password} />}
                        activeIcon={<IconWrapper name={ICONS.activePassword} />}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        rightIcon={<IconWrapper name={showPassword ? ICONS.show : ICONS.hide} />}
                        activeRightIcon={<IconWrapper name={showPassword ? ICONS.activeShow : ICONS.activeHide} />}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity
                        className="self-end mb-5 mt-1"
                        onPress={() => router.push('/(auth)/forgot-password')}
                    >
                        <Text className="text-blue-700 text-sm font-medium">
                            Forgot Password ?
                        </Text>
                    </TouchableOpacity>

                    <Button
                        label="Sign In"
                        onPress={handleSignIn}
                        loading={loading}
                    />

                    {/* Create Account */}
                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-700 text-sm">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                            <Text className="text-blue-700 text-sm font-semibold underline">
                                Create account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* OR Divider */}
                    <OrDivider />

                    {/* Touch ID */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-2"
                        onPress={() => router.push('/(auth)/fingerprint')}
                    >
                        <FingerprintIcon size={28} />
                        <Text className="text-gray-700 text-sm font-medium">
                            use Touch ID
                        </Text>
                    </TouchableOpacity>

                </Wrapper>
            </View>
        </GradientBackground>
    );
}