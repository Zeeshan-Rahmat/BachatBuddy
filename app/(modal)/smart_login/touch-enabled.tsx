import SuccessModal from '@/src/components/modal/SuccessModal';
import React from 'react';

interface TouchEnabledModalProps {
    isVisible: boolean;
    onClose?: () => void;
}

const TouchEnabledModal = ({ isVisible, onClose }: TouchEnabledModalProps) => {

    return (
        <SuccessModal
            title='Touch ID Enabled'
            subtitle='Touch ID has been enabled!'
            isVisible={isVisible}
            onClose={onClose}
        />
    )
}

export default TouchEnabledModal