import GradientBackground from '@/src/components/auth/GradientBackground';
import OrDivider from '@/src/components/auth/OrDivider';
import InputText from '@/src/components/common/InputText';
import ValueSelect from '@/src/components/common/ValueSelect';
import Button from '@components/common/Button';
import IconWrapper from '@components/common/IconWrapper';
import Wrapper from '@components/common/Wrapper';

import TextButton from '@/src/components/common/TextButton';
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


                    <Text className="text-3xl font-semibold text-black text-center mb-8">
                        Sign In
                    </Text>


                    <InputText
                        icon={<IconWrapper name={ICONS.user} />}
                        activeIcon={<IconWrapper name={ICONS.activeUser} />}
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <ValueSelect icon={<IconWrapper name={ICONS.role} />} rightIcon={<IconWrapper name={ICONS.dropdown} />} values={ROLES} value={role} onChange={setRole} />

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

                    <TextButton
                        text='Forgot Password ?'
                        align='self-end'
                        onPress={() => router.push('/(auth)/forgot-password')}
                    />

                    <Button
                        label="Sign In"
                        onPress={handleSignIn}
                        loading={loading}
                    />

                    <View className="flex-row justify-center mt-5">
                        <Text className="text-gray-700 text-base">
                            Don't have an account?{' '}
                        </Text>
                        <TextButton text="Create account" textstyle='underline' onPress={() => router.push('/(auth)/sign-up')} />
                    </View>

                    <OrDivider />

                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-2"
                        onPress={() => router.push('/(auth)/fingerprint')}
                    >
                        <IconWrapper name={ICONS.fingerprint} size={35} />
                        <Text className="ml-2 text-black text-inputText font-semibold">
                            use Touch ID
                        </Text>
                    </TouchableOpacity>

                </Wrapper>
            </View>
        </GradientBackground>
    );
}