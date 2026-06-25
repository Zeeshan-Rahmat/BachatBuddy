import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import CustomeModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import ProfilePicker from '@components/form/ProfilePicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ visible, onClose }: EditProfileModalProps) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '', username: '', email: '',
    });

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | undefined>(undefined);

    const validate = () => {
        const e = { name: '', username: '', email: '', };
        let valid = true;
        if (!name.trim()) { e.name = 'Name is required'; valid = false; }
        if (!username.trim()) { e.username = 'Username is required'; valid = false; }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { e.email = 'Valid email is required'; valid = false; }
        setErrors(e);
        return valid;
    };

    const handleSignUp = async () => {
        if (!validate()) return;
        setLoading(true);

        // TODO: call API → POST /api/auth/register { username, email, password }
        // API sends OTP to email
        // setTimeout(() => {
        //     setLoading(false);
        //     router.push({
        //         pathname: ROUTES.AUTH.SIGN_UP_OTP,
        //         params: { email },
        //     });
        // }, 1000);
    };

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

    return (
        <CustomeModal visible={visible}>
            <Title text='Edit Profile' />

            <InputText
                icon={<IconWrapper name={ICONS.AUTH.user} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                placeholder="Name"
                value={name}
                onChangeText={(t) => { setName(t); setErrors(e => ({ ...e, name: '' })); }}
                error={errors.name}
            />

            <InputText
                icon={<IconWrapper name={ICONS.AUTH.user} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                placeholder="Username"
                value={username}
                onChangeText={(t) => { setUsername(t); setErrors(e => ({ ...e, username: '' })); }}
                error={errors.username}
            />

            <InputText
                icon={<IconWrapper name={ICONS.COMMON.address} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activeAddress} />}
                placeholder="Home Address"
                value={address}
                onChangeText={(t) => setAddress(t)}
            />

            <InputText
                icon={<IconWrapper name={ICONS.COMMON.phone} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activePhone} />}
                placeholder="Phone Number"
                value={phone}
                onChangeText={(t) => setPhone(t)}
                keyboardType='numeric'
            />

            <InputText
                icon={<IconWrapper name={ICONS.AUTH.email} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeEmail} />}
                placeholder="Email Address"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: '' })); }}
                error={errors.email}
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
                />

                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.updateOutline} />}
                    label='UPDATE'
                    width='flex-1'
                />
            </View>
        </CustomeModal>
    )
}

export default EditProfileModal