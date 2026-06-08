import { useState } from 'react';
import { Text, View } from 'react-native';

import GradientBackground from '@/src/components/auth/GradientBackground';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import TextButton from '@/src/components/common/TextButton';
import Wrapper from '@/src/components/common/Wrapper';
import Button from '@components/common/Button';

import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';

export default function SignUpScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        username: '', email: '', password: '', confirm: '',
    });

    const validate = () => {
        const e = { username: '', email: '', password: '', confirm: '' };
        let valid = true;
        if (!username.trim()) { e.username = 'Username is required'; valid = false; }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { e.email = 'Valid email is required'; valid = false; }
        if (!password || password.length < 6) { e.password = 'Password must be at least 6 characters'; valid = false; }
        if (password !== confirmPassword) { e.confirm = 'Passwords do not match'; valid = false; }
        setErrors(e);
        return valid;
    };

    const handleSignUp = async () => {
        if (!validate()) return;
        setLoading(true);

        // TODO: call API → POST /api/auth/register { username, email, password }
        // API sends OTP to email
        setTimeout(() => {
            setLoading(false);
            router.push({
                pathname: ROUTES.AUTH.SIGN_UP_OTP,
                params: { email },
            });
        }, 1000);
    };

    return (
        <GradientBackground>
            <Wrapper>

                <Text className="text-3xl font-semibold text-black text-center mb-8">
                    Sign Up
                </Text>

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.user} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                    placeholder="Username"
                    value={username}
                    onChangeText={(t) => { setUsername(t); setErrors(e => ({ ...e, username: '' })); }}
                    error={errors.username}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.email} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activeEmail} />}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: '' })); }}
                    error={errors.email}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="Password"
                    value={password}
                    onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: '' })); }}
                    secureTextEntry={!showPassword}
                    rightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    error={errors.password}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(t) => { setConfirmPassword(t); setErrors(e => ({ ...e, confirm: '' })); }}
                    secureTextEntry={!showConfirm}
                    rightIcon={<IconWrapper name={showConfirm ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showConfirm ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowConfirm(!showConfirm)}
                    error={errors.confirm}
                />

                <Button
                    label="Sign Up"
                    onPress={handleSignUp}
                    loading={loading}
                />

                <View className="flex-row justify-center mt-5">
                    <Text className="text-gray-700 text-base">
                        Already have an account?{' '}
                    </Text>
                    <TextButton text="Sign In" textstyle='underline' onPress={() => router.push(ROUTES.AUTH.SIGN_IN)} />
                </View>

            </Wrapper>
        </GradientBackground>
    );
}