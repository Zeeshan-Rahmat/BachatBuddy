import Button from '@/src/components/common/Button';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import CustomeBottomModal from '@/src/components/modal/CustomeBottomModal';
import React from 'react';
import { View } from 'react-native';

interface AddProductOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onAddManually?: () => void;
}

const AddProductOptionsModal = ({ visible, onClose, onAddManually }: AddProductOptionsModalProps) => {

    return (
        <CustomeBottomModal isVisible={visible} onClose={onClose}>
            <Title text='Add Product' className='mt-3 mb-3' />
            <Subtitle text='Choose how you want to add the product' />

            {/* Buttons */}
            <View className='flex-row gap-4 mt-2'>
                <Button
                    label='Add Manually'
                    bgColor='blue'
                    width='flex-1'
                    onPress={onAddManually}
                />

                <Button
                    label='Scan QR Code'
                    width='flex-1'
                // onPress={onEdit}
                />
            </View>
        </CustomeBottomModal>
    )
}

export default AddProductOptionsModal