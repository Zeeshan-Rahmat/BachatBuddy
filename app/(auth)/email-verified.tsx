import AuthWrapper from '@/src/components/auth/AuthWrapper';
import GradientBackground from '@/src/components/auth/GradientBackground';
import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ICONS } from '@/src/constants/icons';

import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function EmailVerifiedScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <GradientBackground>
      <AuthWrapper>
        <Wrapper>

          <IconWrapper name={ICONS.largeVerified} size={85} className='self-center mb-5' />

          <Title text='Email Verified' className='mb-3' />

          <Text className="text-dark-50 text-lg text-center mb-7">
            Your email has been verified!
          </Text>

          <Button
            label="Continue to Reset Password"
            onPress={() =>
              router.push({
                pathname: '/(auth)/new-password',
                params: { email },
              })
            }
            width='w-fit'
          />

        </Wrapper>
      </AuthWrapper>
    </GradientBackground>
  );
}