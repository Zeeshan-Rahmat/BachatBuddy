import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import React from 'react';

interface SuccessModalProps {
    title: string;
    subtitle: string;
    isVisible: boolean;
    onClose?: () => void;
}

const SuccessModal = ({ title, subtitle, isVisible, onClose }: SuccessModalProps) => {

    function handleOnPress() {
        onClose;
        router.replace(ROUTES.DASHBOARD);
    }

    return (
        <CustomModal visible={isVisible}>

            <IconWrapper name={ICONS.AUTH.largeVerified} size={85} className='self-center mb-5' />

            <Title text={title} className='mb-2' />

            <Subtitle text={subtitle} fontSize='text-lg' className='mb-8' />

            <Button
                label="Visit Dashboard"
                onPress={handleOnPress}
                leftIcon={<IconWrapper name={ICONS.AUTH.dashboard} size={28} />}
                width='w-fit'
            />

        </CustomModal>
    )
}

export default SuccessModal