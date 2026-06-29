import GradientBackground from '@/src/components/auth/GradientBackground';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import TextButton from '@/src/components/common/TextButton';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ICONS } from '@/src/constants/icons';
import { useResendSignupOtp, useVerifyOtp } from '@/src/hooks/auth/useAuth';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RESEND_COOLDOWN_SECONDS = 60;

export default function SignUpOtpScreen() {

    const { email } = useLocalSearchParams<{ email: string }>();
    const { verify, loading, error, clearError } = useVerifyOtp('signup');
    const {
        resend,
        loading: resendLoading,
        error: resendError,
        clearError: clearResendError,
    } = useResendSignupOtp();

    const [otp, setOtp] = useState('');
    const [emptyFieldError, setEmptyFieldError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);

    const noOfDigits = 6;
    const resendDisabled = resendLoading || resendCooldown > 0;
    const resendText = resendLoading
        ? 'Sending...'
        : resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Didn't receive code? Resend";

    const maskedEmail = email
        ? email.replace(/^(.{4})(.+)(@.{2})(.+)(\..+)$/, '$1****$3***$5')
        : 'your****@email***.com';

    const handleConfirm = async () => {
        if (!otp.trim() || otp.length < noOfDigits) {
            setEmptyFieldError(`Please enter the ${noOfDigits}-digit OTP`);
            return;
        }
        setEmptyFieldError('');

        await verify(email, otp);
    };

    const handleResend = async () => {
        if (resendDisabled) {
            return;
        }

        const sent = await resend(email);

        if (sent) {
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
            Alert.alert('OTP Sent', 'A new verification code has been sent to your email.');
        }
    };

    useEffect(() => {
        if (resendCooldown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCooldown((seconds) => Math.max(seconds - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    useEffect(() => {
        const message = error ?? resendError;

        if (message) {
            Alert.alert(
                "OTP Failed",
                message,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            clearError();
                            clearResendError();
                        }
                    }
                ]
            );
        }
    }, [error, resendError, clearError, clearResendError]);

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
                        Please enter the {noOfDigits} digits code sent to{'\n'}
                        <Text className="font-medium text-dark-100">{maskedEmail}</Text>
                    </Text>

                    {/* OTP Input */}
                    <InputText
                        icon={<IconWrapper name={ICONS.AUTH.otp} />}
                        activeIcon={<IconWrapper name={ICONS.AUTH.activeOTP} />}
                        placeholder={`Enter ${noOfDigits} digits OTP`}
                        value={otp}
                        onChangeText={(text) => { setOtp(text); setEmptyFieldError(''); }}
                        keyboardType="number-pad"
                        maxLength={noOfDigits}
                        error={emptyFieldError}
                    />

                    {/* Confirm Button */}
                    <Button
                        label="Confirm"
                        onPress={handleConfirm}
                        loading={loading}
                    />

                    <View className='h-4' />

                    <TextButton
                        text={resendText}
                        align="self-center"
                        textstyle="underline"
                        onPress={handleResend}
                        disabled={resendDisabled}
                    />

                </Wrapper>
            </KeyboardAwareScrollView>
        </GradientBackground>
    );
}
