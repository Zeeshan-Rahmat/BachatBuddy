import GradientBackground from '@/src/components/auth/GradientBackground';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ICONS } from '@/src/constants/icons';
import { useVerifyOtp } from '@/src/hooks/auth/useAuth';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';

export default function SignUpOtpScreen() {

    const { email } = useLocalSearchParams<{ email: string }>();
    const { verify, loading, error, clearError } = useVerifyOtp('signup');

    const [otp, setOtp] = useState('');
    const [emptyFieldError, setEmptyFieldError] = useState('');

    const noOfDigits = 6;

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

    useEffect(() => {
        if (error) {
            Alert.alert(
                "OTP Verification Faild",
                error,
                [
                    {
                        text: "OK",
                        onPress: () => clearError()
                    }
                ]
            );
        }
    }, [error, clearError]);

    return (
        <GradientBackground>
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

            </Wrapper>
        </GradientBackground>
    );
}