import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import CustomeModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import { createEmployee, updateEmployee } from '@/src/db/repositories/employeesRepository';
import { useAuthStore } from '@/src/store/authStore';
import { EmployeeType } from '@/src/types/appTypes';
import ProfilePicker from '@components/form/ProfilePicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

interface AddEditEmployeeModalProps {
    visible: boolean;
    title?: "Add Employee" | "Edit Employee";
    employee?: EmployeeType;
    onClose: () => void;
    onSaved?: () => void;
}

const AddEditEmployeeModal = ({ visible, title = "Edit Employee", employee, onClose, onSaved }: AddEditEmployeeModalProps) => {
    const currentUser = useAuthStore((state) => state.user);
    const requiresApproval = useAuthStore((state) => state.requiresApproval);

    const [name, setName] = useState(employee?.name ?? "");
    const [email, setEmail] = useState(employee?.email ?? "");
    const [password, setPassword] = useState(employee?.password ?? "");
    const [address, setAddress] = useState(employee?.address ?? "");
    const [phone, setPhone] = useState(employee?.phone ?? "");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '', email: '', password: '', phone: '', address: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const [imageUri, setImageUri] = useState<string | null>(employee?.img ?? null);
    const [imageError, setImageError] = useState<string | undefined>(undefined);

    const validate = () => {
        const e = { name: '', email: '', password: '', phone: '', address: '' };
        let valid = true;
        if (!name.trim()) { e.name = 'Name is required'; valid = false; }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { e.email = 'Valid email is required'; valid = false; }
        if (!employee && !password.trim()) { e.password = 'Password is required'; valid = false; }
        if (!phone.trim()) { e.phone = 'Phone is required'; valid = false; }
        if (!address.trim()) { e.address = 'Address is required'; valid = false; }
        setErrors(e);
        return valid;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const businessId = currentUser?.businessId ?? currentUser?.id;

            if (!businessId) {
                Alert.alert('Save failed', 'Unable to identify the active business for this employee.');
                return;
            }

            if (employee?.employee_id) {
                await updateEmployee(employee.employee_id, {
                    businessId,
                    businessName: currentUser?.businessName ?? null,
                    name: name.trim(),
                    email: normalizedEmail,
                    username: employee.username || normalizedEmail,
                    phone: phone.trim(),
                    address: address.trim(),
                    img: imageUri,
                    passwordHash: password.trim() || undefined,
                    requiresApproval: requiresApproval(),
                });
            } else {
                await createEmployee({
                    businessId,
                    businessName: currentUser?.businessName ?? null,
                    name: name.trim(),
                    email: normalizedEmail,
                    username: normalizedEmail,
                    phone: phone.trim(),
                    address: address.trim(),
                    img: imageUri,
                    passwordHash: password.trim() || null,
                    requiresApproval: requiresApproval(),
                });
            }

            onSaved?.();
            onClose();
        } catch {
            Alert.alert('Save failed', 'Unable to save this employee locally. Please try again.');
        } finally {
            setLoading(false);
        }
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
            <Title text={title} />

            {/* Name Input Box */}
            <InputText
                icon={<IconWrapper name={ICONS.AUTH.user} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeUser} />}
                placeholder="Name"
                value={name}
                onChangeText={(t) => { setName(t); setErrors(e => ({ ...e, name: '' })); }}
                error={errors.name}
            />

            {/* Email Input Box */}
            <InputText
                icon={<IconWrapper name={ICONS.AUTH.email} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activeEmail} />}
                placeholder="Email Address"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: '' })); }}
                error={errors.email}
            />

            {/* Password Input Box */}
            <InputText
                icon={<IconWrapper name={ICONS.AUTH.password} />}
                activeIcon={<IconWrapper name={ICONS.AUTH.activePassword} />}
                placeholder="Enter your password"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: '' })); }}
                secureTextEntry={!showPassword}
                rightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.show : ICONS.AUTH.hide} />}
                activeRightIcon={<IconWrapper name={showPassword ? ICONS.AUTH.activeShow : ICONS.AUTH.activeHide} />}
                onRightIconPress={() => setShowPassword(!showPassword)}
                error={errors.password}
            />

            {/* Phone Input Box */}
            <InputText
                icon={<IconWrapper name={ICONS.COMMON.phone} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activePhone} />}
                placeholder="Phone Number"
                value={phone}
                onChangeText={(t) => { setPhone(t); setErrors(e => ({ ...e, phone: '' })); }}
                keyboardType='numeric'
            />

            {/* Address Input Box */}
            <InputText
                icon={<IconWrapper name={ICONS.COMMON.address} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activeAddress} />}
                placeholder="Home Address"
                value={address}
                onChangeText={(t) => { setAddress(t); setErrors(e => ({ ...e, address: '' })); }}
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

            {/* Buttons */}
            <View className='flex-row gap-4'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                    label='CANCEL'
                    bgColor='gray'
                    width='flex-1'
                    onPress={onClose}
                />

                <Button
                    leftIcon={<IconWrapper name={employee ? ICONS.COMMON.updateOutline : ICONS.COMMON.plus} />}
                    label={employee ? 'UPDATE' : 'ADD'}
                    width='flex-1'
                    loading={loading}
                    onPress={handleSave}
                />
            </View>
        </CustomeModal>
    )
}

export default AddEditEmployeeModal
