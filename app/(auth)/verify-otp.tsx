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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// This screen is shared between two flows:
// flow === 'reset'   → came from forgot-password → goes to new-password
// flow === 'signup'  → came from sign-up         → goes to sign-up-verified

export default function VerifyOtpScreen() {
    const { email, flow } = useLocalSearchParams<{ email: string; flow: 'reset' | 'signup' }>();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mask email: your*****@email***.com
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

        // TODO: call API → POST /api/auth/verify-otp { email, otp, flow }
        setTimeout(() => {
            setLoading(false);
            if (flow === 'reset') {
                router.push({
                    pathname: ROUTES.AUTH.EMAIL_VERIFIED,
                    params: { email, flow: 'reset' },
                });
            } else {
                router.push({
                    pathname: ROUTES.AUTH.SIGN_UP_VERIFIED,
                    params: { email },
                });
            }
        }, 1000);
    };

    return (
        <GradientBackground>
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                }}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <Wrapper>

                    <Title text='Verify your email' className='mb-4' />

                    <Text className="text-dark-50 text-base text-center mb-8 leading-5 px-2">
                        Please enter the 4 digits code sent to{'\n'}
                        <Text className="font-medium text-dark-100">{maskedEmail}</Text>
                    </Text>

                    <InputText
                        icon={<IconWrapper name={ICONS.AUTH.otp} />}
                        activeIcon={<IconWrapper name={ICONS.AUTH.activeOTP} />}
                        placeholder="Enter 4 digits OTP"
                        value={otp}
                        onChangeText={(text) => { setOtp(text); setError(''); }}
                        keyboardType="number-pad"
                        maxLength={4}
                        error={error}
                    />

                    <Button
                        label="Confirm"
                        onPress={handleConfirm}
                        loading={loading}
                    />

                </Wrapper>
            </KeyboardAwareScrollView>
        </GradientBackground>
    );
}
