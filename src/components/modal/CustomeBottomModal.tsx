import React from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';

interface CustomeBottomModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const CustomeBottomModal = ({ isVisible, onClose, children }: CustomeBottomModalProps) => {


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >

            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

                    {/* Bottom Sheet Container */}
                    <TouchableWithoutFeedback>
                        <View className="bg-light-300 rounded-t-2xl pb-8 pt-4 px-5 shadow-2xl">

                            {/* Drag Handle Indicator Pill */}
                            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />

                            {/* Menu Action List */}
                            {children}

                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default CustomeBottomModal