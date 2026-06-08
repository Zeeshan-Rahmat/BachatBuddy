import GradientBackground from '@/src/components/auth/GradientBackground';
import OrDivider from '@/src/components/auth/OrDivider';
import InputText from '@/src/components/common/InputText';
import TextButton from '@/src/components/common/TextButton';
import ValueSelect from '@/src/components/common/ValueSelect';
import Button from '@components/common/Button';
import IconWrapper from '@components/common/IconWrapper';
import Wrapper from '@components/common/Wrapper';

import Title from '@/src/components/common/Title';
import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        username: '', role: '', password: '',
    });


    const ROLES = ['Owner', 'Employee'];

    const validate = () => {
        const e = { username: '', role: '', password: '' };
        let valid = true;
        if (!username.trim()) { e.username = 'Username is required'; valid = false; }
        if (!role.trim()) { e.role = 'Role is required'; valid = false; }
        if (!password) { e.password = 'Password is required'; valid = false; }
        setErrors(e);
        return valid;
    };

    const handleSignIn = async () => {
        if (!validate()) return;
        setLoading(true);
        // TODO: connect to your Node.js/Express API
        // const response = await authService.signIn({ username, role, password });
        setTimeout(() => {
            setLoading(false);
            router.replace(ROUTES.DASHBOARD);
        }, 1000);
    };

    return (
        <GradientBackground>
            <Wrapper>

                <Title text='Sign In' />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.user} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={(t) => { setUsername(t); setErrors(e => ({ ...e, username: '' })); }}
                    error={errors.username}
                />

                <ValueSelect
                    icon={<IconWrapper name={ICONS.AUTH.role} />}
                    rightIcon={<IconWrapper name={ICONS.AUTH.dropdown} />}
                    values={ROLES}
                    value={role}
                    onChange={(t) => { setRole(t); setErrors(e => ({ ...e, role: '' })); }}
                    error={errors.role}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: '' })); }}
                    secureTextEntry={!showPassword}
                    rightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    error={errors.password}
                />

                <TextButton
                    text='Forgot Password ?'
                    align='self-end'
                    onPress={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
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
                    <TextButton text="Create account" textstyle='underline' onPress={() => router.push(ROUTES.AUTH.SIGN_UP)} />
                </View>

                <OrDivider />

                <TouchableOpacity
                    className="flex-row items-center justify-center gap-2"
                    onPress={() => router.push(ROUTES.AUTH.FINGERPRINT)}
                >
                    <IconWrapper name={ICONS.AUTH.fingerprint} size={35} />
                    <Text className="ml-2 text-black text-inputText font-semibold">
                        use Touch ID
                    </Text>
                </TouchableOpacity>

            </Wrapper>
        </GradientBackground>
    );
}