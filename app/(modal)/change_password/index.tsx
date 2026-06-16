import Button from '@/src/components/common/Button'
import IconWrapper from '@/src/components/common/IconWrapper'
import InputText from '@/src/components/common/InputText'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import Subtitle from '@/src/components/common/Subtitle'
import TextButton from '@/src/components/common/TextButton'
import Title from '@/src/components/common/Title'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import { ICONS } from '@/src/constants/icons'
import { ROUTES } from '@/src/constants/routes'
import { COLORS } from '@/src/constants/theme'
import { router } from 'expo-router'
import React, { useState } from 'react'
import PasswordChandedModal from './password-changed'


const ChangePasswordScreen = () => {


    const [isOpen, setIsOpen] = useState(false)

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ oldPassword: '', password: '', confirm: '' });

    const handleSubmit = async () => {
        const newErrors = { oldPassword: '', password: '', confirm: '' };

        if (!oldPassword.trim()) {
            newErrors.oldPassword = 'Please enter your old password';
        }
        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (oldPassword === password) {
            newErrors.password = 'New Password must be at different from old password';
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

            setIsOpen(true);

        }, 1000);
    };


    return (
        <ScreenWrapper
            title='Change Password'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>

                <Title text='Create New Password' className='text-left mt-2 mb-2' />

                <Subtitle text='Your new password should be different from previous used passwords' className='text-left  mb-8' />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="Old Password"
                    value={oldPassword}
                    onChangeText={(text) => { setOldPassword(text); setErrors(e => ({ ...e, oldPassword: '' })); }}
                    secureTextEntry={!showOldPassword}
                    rightIcon={<IconWrapper name={showOldPassword ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showOldPassword ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowOldPassword(!showOldPassword)}
                    error={errors.oldPassword}
                    bgColor={COLORS.white}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="New Password"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrors(e => ({ ...e, password: '' })); }}
                    secureTextEntry={!showPassword}
                    rightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    error={errors.password}
                    bgColor={COLORS.white}
                />

                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.password} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={(text) => { setConfirmPassword(text); setErrors(e => ({ ...e, confirm: '' })); }}
                    secureTextEntry={!showConfirm}
                    rightIcon={<IconWrapper name={showConfirm ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                    activeRightIcon={<IconWrapper name={showConfirm ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                    onRightIconPress={() => setShowConfirm(!showConfirm)}
                    error={errors.confirm}
                    bgColor={COLORS.white}
                />


                <TextButton
                    text='Forgot Password ?'
                    align='self-end'
                    onPress={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
                />

                <Button
                    label="Change Password"
                    onPress={handleSubmit}
                    loading={loading}
                />

            </PaddingWrapper>

            <PasswordChandedModal isVisible={isOpen} onClose={() => setIsOpen(false)} />
        </ScreenWrapper>
    )
}

export default ChangePasswordScreen