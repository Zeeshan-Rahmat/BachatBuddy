import Button from '@/src/components/common/Button'
import IconWrapper from '@/src/components/common/IconWrapper'
import InputText from '@/src/components/common/InputText'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import Subtitle from '@/src/components/common/Subtitle'
import TextButton from '@/src/components/common/TextButton'
import Title from '@/src/components/common/Title'
import ValueSelect from '@/src/components/common/ValueSelect'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import { ICONS } from '@/src/constants/icons'
import { ROUTES } from '@/src/constants/routes'
import { COLORS } from '@/src/constants/theme'
import { router } from 'expo-router'
import React, { useState } from 'react'
import TouchEnabledModal from './touch-enabled'


const SmartLoginScreen = () => {

    const [isOpen, setIsOpen] = useState(false)

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

            setIsOpen(true);

        }, 1000);
    };

    return (
        <ScreenWrapper
            title='Smart Login'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>

                <IconWrapper name={ICONS.AUTH.largeFingerprint} size={56} className='self-center mb-4 mt-5' />

                <Title text="Touch ID" fontSize='text-2xl' className='mb-2' />

                <Subtitle text={`To enable Touch ID please login to${'\n'}your account`} className='mb-7' />


                <InputText
                    icon={<IconWrapper name={ICONS.AUTH.user} />}
                    activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    bgColor={COLORS.white}
                    error={errors.username}
                />

                <ValueSelect
                    icon={<IconWrapper name={ICONS.AUTH.role} />}
                    rightIcon={<IconWrapper name={ICONS.AUTH.dropdown} />}
                    values={ROLES} value={role}
                    onChange={setRole}
                    bgColor={COLORS.white}
                    error={errors.role}
                />

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
                    bgColor={COLORS.white}
                    error={errors.password}
                />

                <TextButton
                    text='Forgot Password ?'
                    align='self-end'
                    onPress={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
                />

                <Button
                    label="Enable Touch ID"
                    onPress={handleSignIn}
                    loading={loading}
                />

            </PaddingWrapper>

            <TouchEnabledModal isVisible={isOpen} onClose={() => setIsOpen(false)} />
        </ScreenWrapper>
    )
}

export default SmartLoginScreen