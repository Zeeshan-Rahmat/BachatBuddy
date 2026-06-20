import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import React from 'react';
import { View } from 'react-native';

interface DeleteModalProps {
    title: string;
    subtitle: string;
    removeItem: string;
    isVisible: boolean;
    onClose?: (() => void) | undefined;
    onDelete?: (() => void) | undefined;
}

const DeleteModal = ({ title, subtitle, removeItem, isVisible, onClose, onDelete }: DeleteModalProps) => {


    // // ── Logout ──────────────────────────────────────────────────────────────────
    //   const handleLogout = useCallback(async () => {
    //     onClose();
    //     // await handleSignOut();
    //   }, [onClose]);
    //   // }, [onClose, handleSignOut]);

    return (
        <CustomModal visible={isVisible}>

            <IconWrapper name={ICONS.COMMON.dangerIcon} size={85} className='self-center mb-5' />

            <Title text={title} className='mb-5' />

            <Subtitle text={subtitle} fontSize='text-lg' className='mb-2' />

            <Subtitle text={`"${removeItem}"`} fontSize='text-lg' className='mb-8 text-dark-300 font-bold' />

            <View className='flex-row gap-4'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                    label='CANCEL'
                    bgColor='gray'
                    width='flex-1'
                    onPress={onClose}
                />

                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.deleteWhite} />}
                    label='DELETE'
                    width='flex-1'
                    bgColor='red'
                    onPress={onDelete}
                />
            </View>

        </CustomModal>
    )
}

export default DeleteModal