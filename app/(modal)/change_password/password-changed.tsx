import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import React from 'react';

interface PasswordChandedModalProps {
    isVisible: boolean;
    onClose?: () => void;
}

const PasswordChandedModal = ({ isVisible, onClose }: PasswordChandedModalProps) => {

    function handleOnPress() {
        onClose;
        router.replace(ROUTES.DASHBOARD);
    }

    return (
        <CustomModal visible={isVisible}>

            <IconWrapper name={ICONS.AUTH.largeVerified} size={85} className='self-center mb-5' />

            <Title text='Password Reset' className='mb-2' />

            <Subtitle text='Your password has been updated!' fontSize='text-lg' className='mb-8' />

            <Button
                label="Visit Dashboard"
                onPress={handleOnPress}
                leftIcon={<IconWrapper name={ICONS.AUTH.dashboard} size={28} />}
                width='w-fit'
            />

        </CustomModal>
    )
}

export default PasswordChandedModal