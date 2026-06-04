import AuthWrapper from '@/src/components/auth/AuthWrapper';
import GradientBackground from '@/src/components/auth/GradientBackground';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

export default function SignUpOtpScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const maskedEmail = email
        ? email.replace(/^(.{4})(.+)(@.{2})(.+)(\..+)$/, '$1****$3***$5')
        : 'your****@email***.com';

    const handleConfirm = async () => {
        if (!otp.trim() || otp.length < 4) {
            setError('Please enter the 4-digit OTP');
            return;
        }
        setError('');
        setLoading(true);

        // TODO: call API → POST /api/auth/verify-otp { email, otp }
        setTimeout(() => {
            setLoading(false);
            router.push({
                pathname: ROUTES.AUTH.SIGN_UP_VERIFIED,
                params: { email },
            });
        }, 1000);
    };

    return (
        <GradientBackground>
            <AuthWrapper>
                <Wrapper>

                    <Title text='Verify your email' className='mb-4' />

                    <Text className="text-dark-50 text-base text-center mb-8 leading-5 px-2">
                        Please enter the 4 digits code sent to{'\n'}
                        <Text className="font-medium text-dark-100">{maskedEmail}</Text>
                    </Text>

                    {/* OTP Input */}
                    <InputText
                        icon={<IconWrapper name={ICONS.otp} />}
                        activeIcon={<IconWrapper name={ICONS.activeOTP} />}
                        placeholder="Enter 4 digits OTP"
                        value={otp}
                        onChangeText={(text) => { setOtp(text); setError(''); }}
                        keyboardType="number-pad"
                        maxLength={4}
                        error={error}
                    />

                    {/* Confirm Button */}
                    <Button
                        label="Confirm"
                        onPress={handleConfirm}
                        loading={loading}
                    />

                </Wrapper>
            </AuthWrapper>
        </GradientBackground>
    );
}