import GradientBackground from '@/src/components/auth/GradientBackground';
import InputText from '@/src/components/common/InputText';
import TextButton from '@/src/components/common/TextButton';
import ValueSelect from '@/src/components/common/ValueSelect';
import Button from '@components/common/Button';
import IconWrapper from '@components/common/IconWrapper';
import Wrapper from '@components/common/Wrapper';

import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function ManageFingerprintScreen() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const ROLES = ['Owner', 'Employee'];

    const handleSignIn = async () => {
        setLoading(true);
        // TODO: verify credentials then enable biometric via expo-local-authentication
        // await LocalAuthentication.authenticateAsync(...)
        setTimeout(() => {
            setLoading(false);
            router.replace(ROUTES.AUTH.FINGERPRINT);
        }, 1000);
    };

    return (
        <GradientBackground>
            <Wrapper>

                <IconWrapper name={ICONS.AUTH.largeFingerprint} size={56} className='self-center mb-4' />

                <Title text="Touch ID" fontSize='text-2xl' className='mb-2' />

                <Subtitle text={`To enable Touch ID please login to${'\n'}your account`} className='mb-7' />


                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.user} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                />

                <ValueSelect icon={<IconWrapper name={ICONS.AUTH.role} />} rightIcon={<IconWrapper name={ICONS.AUTH.dropdown} />} values={ROLES} value={role} onChange={setRole} />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    rightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
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
                    <TextButton text="Create account" textstyle='underline' onPress={() => router.push('/(auth)/sign-up')} />
                </View>

            </Wrapper>
        </GradientBackground>
    );
}