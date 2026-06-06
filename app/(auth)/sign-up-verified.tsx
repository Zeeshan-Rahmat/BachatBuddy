import GradientBackground from '@/src/components/auth/GradientBackground';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Subtitle from '@/src/components/common/Subtitle';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ICONS } from '@/src/constants/icons';

import { router } from 'expo-router';

export default function SignUpVerifiedScreen() {
    return (
        <GradientBackground>
            <Wrapper>

                <IconWrapper name={ICONS.largeVerified} size={85} className='self-center mb-5' />

                <Title text='Email Verified' className='mb-2' />

                <Subtitle text='Your email has been verified!' fontSize='text-lg' className='mb-8' />

                <Button
                    label="Visit Dashboard"
                    onPress={() => router.replace('/(app)/dashboard')}
                    leftIcon={<IconWrapper name={ICONS.dashboard} size={28} />}
                    width='w-fit'
                />

            </Wrapper>
        </GradientBackground>
    );
}