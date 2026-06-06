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

export default function NewPasswordScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ password: '', confirm: '' });

    const handleSubmit = async () => {
        const newErrors = { password: '', confirm: '' };

        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (password !== confirmPassword) {
            newErrors.confirm = 'Passwords do not match';
        }
        if (newErrors.password || newErrors.confirm) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        // TODO: call API → POST /api/auth/reset-password { email, password }
        setTimeout(() => {
            setLoading(false);
            router.push(ROUTES.AUTH.PASSWORD_UPDATED);
        }, 1000);
    };

    return (
        <GradientBackground>
            <Wrapper>

                <Title text='Create New Password' />

                <InputText
                    icon={<IconWrapper name={ICONS.password} />}
                    activeIcon={<IconWrapper name={ICONS.activePassword} />}
                    placeholder="New Password"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrors(e => ({ ...e, password: '' })); }}
                    secureTextEntry={!showPassword}
                    rightIcon={<IconWrapper name={showPassword ? ICONS.show : ICONS.hide} />}
                    activeRightIcon={<IconWrapper name={showPassword ? ICONS.activeShow : ICONS.activeHide} />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    error={errors.password}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.password} />}
                    activeIcon={<IconWrapper name={ICONS.activePassword} />}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={(text) => { setConfirmPassword(text); setErrors(e => ({ ...e, confirm: '' })); }}
                    secureTextEntry={!showConfirm}
                    rightIcon={<IconWrapper name={showPassword ? ICONS.show : ICONS.hide} />}
                    activeRightIcon={<IconWrapper name={showPassword ? ICONS.activeShow : ICONS.activeHide} />}
                    onRightIconPress={() => setShowConfirm(!showConfirm)}
                    error={errors.confirm}
                />

                <Button
                    label="Update Password"
                    onPress={handleSubmit}
                    loading={loading}
                />

            </Wrapper>
        </GradientBackground>
    );
}