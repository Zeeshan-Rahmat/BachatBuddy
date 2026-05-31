import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

import "@/src/components/auth/AuthComponents";

import { GradientBackground } from '@/src/components/auth/AuthComponents';

export default function SplashScreen() {

  useEffect(() => {
    // Navigate to sign-in after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/sign-in');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center">
        {/* App Name — centered vertically */}
        <Text
          className="text-white text-5xl text-center"
          style={{ fontWeight: '700', letterSpacing: 1 }}
        >
          Bachat{'\n'}Buddy
        </Text>
      </View>

      {/* Illustration at the bottom — replace src with your actual asset */}
      <View className="absolute bottom-0 right-0">
        <Image
          source={require('../assets/images/splash-illustration.png')}
          className="w-full"
          style={{ height: 220 }}
          resizeMode="cover"
          // Remove the image tag entirely if you don't have the asset yet
          // and uncomment the placeholder below:
          onError={() => { }}
        />
      </View>
    </GradientBackground>
  );
}