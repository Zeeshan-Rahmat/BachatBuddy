import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import * as NativeSplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

import GradientBackground from '@/src/components/auth/GradientBackground';
import { ROUTES } from '@/src/constants/routes';


NativeSplashScreen.preventAutoHideAsync().catch(() => { });

export default function SplashScreen() {
  const splashScreenImage = '../assets/images/splash-illustration.png';

  const [assets, error] = useAssets([
    require(splashScreenImage),
  ]);

  useEffect(() => {
    if (assets) {

      NativeSplashScreen.hideAsync().catch(() => { });

      const timer = setTimeout(() => {
        router.replace(ROUTES.AUTH.SIGN_IN);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [assets]);


  if (!assets) {
    return null;
  }

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center">
        <Text
          className="text-white text-5xl text-center"
          style={{ fontWeight: '700', letterSpacing: 2.5, lineHeight: 50 }}
        >
          Bachat{'\n'}Buddy
        </Text>
      </View>

      <View className="absolute bottom-0 right-0">
        <Image
          source={require(splashScreenImage)}
          className="w-full"
          style={{ height: 220 }}
          resizeMode="cover"
        />
      </View>
    </GradientBackground>
  );
}