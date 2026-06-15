import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import * as NativeSplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import GradientBackground from '@/src/components/auth/GradientBackground';
import { ROUTES } from '@/src/constants/routes';

NativeSplashScreen.preventAutoHideAsync().catch(() => { });


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen() {
  const isBoimetricEnable = true;


  const [assets, error] = useAssets([
    require('../assets/images/splash-illustration.png'),
  ]);

  useEffect(() => {
    if (assets) {
      NativeSplashScreen.hideAsync().catch(() => { });

      const timer = setTimeout(() => {
        router.replace(isBoimetricEnable ? ROUTES.AUTH.FINGERPRINT : ROUTES.AUTH.SIGN_IN);
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


      <View style={{ position: 'absolute', bottom: 0, right: 0, width: SCREEN_WIDTH }}>
        <Image
          source={require('../assets/images/splash-illustration.png')}
          style={{ width: '100%', height: 250 }}
          resizeMode="cover"
        />
      </View>
    </GradientBackground>
  );
}