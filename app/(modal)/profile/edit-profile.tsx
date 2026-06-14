import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import ValueSelect from '@/src/components/common/ValueSelect';
import DateInput from '@/src/components/form/DateInput';
import CustomeModal from '@/src/components/modal/CustomModal';
import { ICONS } from '@/src/constants/icons';
import React, { useState } from 'react';
import { View } from 'react-native';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ visible, onClose }: EditProfileModalProps) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '', username: '', email: '',
    });


    const GENDER = ['Male', 'Female'];

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

            <View className='flex-row gap-4'>
                <ValueSelect
                    flex={1}
                    icon={<IconWrapper name={ICONS.COMMON.gender} />}
                    rightIcon={<IconWrapper name={ICONS.AUTH.dropdown} />}
                    values={GENDER}
                    value={gender}
                    placeholder='Gender'
                    onChange={(t) => setGender(t)}
                />

                <DateInput
                    flex={1}
                    date={birthDate}
                    onDateChange={(newDate) => {
                        setBirthDate(newDate);
                        setFormError(undefined); // Clear error after selecting
                    }}
                    placeholder="Date of Birth"
                    icon={<IconWrapper name={ICONS.COMMON.date} />}
                    activeIcon={<IconWrapper name={ICONS.COMMON.activeDate} />}
                    error={formError}
                />
            </View>

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