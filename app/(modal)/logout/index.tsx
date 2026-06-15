import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import React from 'react';
import { View } from 'react-native';

interface LogoutModalProps {
    isVisible: boolean;
    onClose?: (() => void) | undefined
}

const LogoutModal = ({ isVisible, onClose }: LogoutModalProps) => {


    // // ── Logout ──────────────────────────────────────────────────────────────────
    //   const handleLogout = useCallback(async () => {
    //     onClose();
    //     // await handleSignOut();
    //   }, [onClose]);
    //   // }, [onClose, handleSignOut]);

    return (
        <CustomModal visible={isVisible}>

            <IconWrapper name={ICONS.COMMON.dangerIcon} size={85} className='self-center mb-5' />

            <Title text='Account Logout' className='mb-2' />

            <Subtitle text='Are sure you want to logout?' fontSize='text-lg' className='mb-8' />

            <View className='flex-row gap-4'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                    label='CANCEL'
                    bgColor='gray'
                    width='flex-1'
                    onPress={onClose}
                />

                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.logoutWhite} />}
                    label='LOGOUT'
                    width='flex-1'
                    bgColor='red'
                />
            </View>

        </CustomModal>
    )
}

export default LogoutModal