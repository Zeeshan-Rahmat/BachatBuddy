import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Title from '@/src/components/common/Title';
import DateInput from '@/src/components/form/DateInput';
import CustomeModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { updateInvoiceDetail } from '@/src/db/repositories/invoicesRepository';
import { useAuthStore } from '@/src/store/authStore';
import { InvoiceType } from '@/src/types/appTypes';
import ProfilePicker from '@components/form/ProfilePicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

interface EditInvoiceDetailModalProps {
    visible: boolean;
    invoice: InvoiceType;
    onClose: () => void;
    onSaved?: () => void;
    onDraftChange?: (values: Pick<InvoiceType, 'due_date' | 'img'>) => void;
}

const EditInvoiceDetailModal = ({ visible, invoice, onClose, onSaved, onDraftChange }: EditInvoiceDetailModalProps) => {
    const currentUser = useAuthStore((state) => state.user);
    const requiresApproval = useAuthStore((state) => state.requiresApproval);

    const [loading, setLoading] = useState(false);


    const [dueDate, setDueDate] = useState<Date | undefined>(new Date(invoice.due_date));
    const [dueDateError, setDueDateError] = useState<string | undefined>(undefined);

    const [imageUri, setImageUri] = useState<string | null>(invoice.img ?? null);
    const [imageError, setImageError] = useState<string | undefined>(undefined);

    // This function asks for permission and opens the image gallery
    const handlePickImage = async () => {
        setImageError(undefined); // Reset errors

        // Request media library permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to upload a profile picture.");
            return;
        }

        // Launch the photo gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Shows standard cropping square box
            aspect: [1, 1],      // Forces a 1:1 square crop ratio
            quality: 0.8,        // Compresses image slightly for faster uploads
        });

        // Save image URI if user did not cancel
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };


    const handleUpdate = async () => {
        if (!dueDate) {
            setDueDateError('Due date is required');
            return;
        }

        setLoading(true);

        try {
            if (onDraftChange) {
                onDraftChange({
                    due_date: dueDate.toISOString(),
                    img: imageUri ?? undefined,
                });
            } else {
                await updateInvoiceDetail(invoice.invoice_id, {
                    lastUpdatedById: currentUser?.id ?? null,
                    dueDate: dueDate.getTime(),
                    img: imageUri,
                    requiresApproval: requiresApproval(),
                });

                onSaved?.();
            }

            onClose();
        } catch {
            Alert.alert('Update failed', 'Unable to update this invoice locally. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomeModal visible={visible}>
                <Title text='Edit Invoice Detail' />

                <DateInput
                    date={dueDate}
                    onDateChange={(newDate) => {
                        setDueDate(newDate);
                        setDueDateError(undefined); // Clear error after selecting
                    }}
                    placeholder="Invoice Due Date"
                    icon={<IconWrapper name={ICONS.COMMON.date} />}
                    activeIcon={<IconWrapper name={ICONS.COMMON.activeDate} />}
                    error={dueDateError}
                />

                <ProfilePicker
                    imageUri={imageUri}
                    onPickImage={handlePickImage}
                    error={imageError}
                    icon={<IconWrapper name={ICONS.COMMON.addImage} />}
                    activeIcon={<IconWrapper name={ICONS.COMMON.activeAddImage} />}
                    rightIcon={<IconWrapper name={ICONS.COMMON.camera} />}
                    activeRightIcon={<IconWrapper name={ICONS.AUTH.largeVerified} />}
                />

                <View className='flex-row mt-3 gap-4'>
                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                        label='CANCEL'
                        bgColor='gray'
                        width='flex-1'
                        onPress={onClose}
                    />

                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.updateOutline} />}
                        label='UPDATE'
                        width='flex-1'
                        loading={loading}
                        onPress={handleUpdate}
                    />
                </View>
            </CustomeModal>
        </>
    )
}

export default EditInvoiceDetailModal
