import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import CustomeModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { updateUser } from '@/src/services/profileService';
import { useAuthStore } from '@/src/store/authStore';
import type { User } from '@/src/types/auth';
import ProfilePicker from '@components/form/ProfilePicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

interface EditProfileModalProps {
    visible: boolean;
    user: User;
    onClose: () => void;
}

const EditProfileModal = ({ visible, user, onClose }: EditProfileModalProps) => {
    const updateStoreUser = useAuthStore((state) => state.updateUser);
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [address, setAddress] = useState(user.address ?? '');
    const [phone, setPhone] = useState(user.phone ?? '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        username: '',
        email: '',
    });

    const [imageUri, setImageUri] = useState<string | null>(user.img);
    const [imageError, setImageError] = useState<string | undefined>(undefined);

    const validate = () => {
        const nextErrors = { name: '', username: '', email: '' };
        let valid = true;

        if (!name.trim()) {
            nextErrors.name = 'Name is required';
            valid = false;
        }

        if (!username.trim()) {
            nextErrors.username = 'Username is required';
            valid = false;
        }

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            nextErrors.email = 'Valid email is required';
            valid = false;
        }

        setErrors(nextErrors);
        return valid;
    };

    const handleUpdate = async () => {
        if (!validate()) return;

        setLoading(true);
        const result = await updateUser(user.id, {
            name: name.trim(),
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            address: address.trim() || null,
            phone: phone.trim() || null,
            img: imageUri,
        });
        setLoading(false);

        if (!result.success) {
            Alert.alert('Update Failed', result.error);
            return;
        }

        updateStoreUser(result.data);
        onClose();
    };

    const handlePickImage = async () => {
        setImageError(undefined);

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to allow access to your photos to upload a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <CustomeModal visible={visible}>
            <Title text='Edit Profile' />

            <InputText
                icon={<IconWrapper name={ICONS.AUTH.user} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                placeholder='Name'
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    setErrors((current) => ({ ...current, name: '' }));
                }}
                error={errors.name}
            />

            <InputText
                icon={<IconWrapper name={ICONS.AUTH.user} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                placeholder='Username'
                value={username}
                onChangeText={(text) => {
                    setUsername(text);
                    setErrors((current) => ({ ...current, username: '' }));
                }}
                error={errors.username}
            />

            <InputText
                icon={<IconWrapper name={ICONS.COMMON.address} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activeAddress} />}
                placeholder='Home Address'
                value={address}
                onChangeText={(text) => setAddress(text)}
            />

            <InputText
                icon={<IconWrapper name={ICONS.COMMON.phone} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activePhone} />}
                placeholder='Phone Number'
                value={phone}
                onChangeText={(text) => setPhone(text)}
                keyboardType='phone-pad'
            />

            <InputText
                icon={<IconWrapper name={ICONS.AUTH.email} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeEmail} />}
                placeholder='Email Address'
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors((current) => ({ ...current, email: '' }));
                }}
                error={errors.email}
                keyboardType='email-address'
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

            <View className='flex-row gap-4'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                    label='CANCEL'
                    bgColor='gray'
                    width='flex-1'
                    onPress={onClose}
                    isDisabled={loading}
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
    );
};

export default EditProfileModal;
