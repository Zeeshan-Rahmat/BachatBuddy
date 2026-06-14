import React from 'react';
import { Modal, View } from 'react-native';
import Wrapper from '../common/Wrapper';

const CustomModal = ({
    children,
    visible,
}: {
    children: React.ReactNode;
    visible: boolean;
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View
                className="flex-1 justify-center items-center p-5"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <Wrapper>
                    {children}
                </Wrapper>
            </View>
        </Modal>
    );
};

export default CustomModal;