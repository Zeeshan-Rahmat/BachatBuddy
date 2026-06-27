import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import * as NativeSplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import GradientBackground from '@/src/components/auth/GradientBackground';
import { ROUTES } from '@/src/constants/routes';
import { useBiometricStore } from '@/src/store/biometricStore';

NativeSplashScreen.preventAutoHideAsync().catch(() => { });


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen() {
  const { enabled, isChecking, checkEnabled } = useBiometricStore();

  // 1. Load assets
  const [assets] = useAssets([
    require('../assets/images/splash-illustration.png'),
  ]);

  // 2. Run the biometric check once when the app mounts
  useEffect(() => {
    checkEnabled();
  }, [checkEnabled]);

  // 3. Handle routing and hiding the splash screen ONLY when everything is ready
  useEffect(() => {
    // Wait until both assets are loaded AND the biometric check is done
    if (!assets || isChecking) {
      return;
    }

    // Safely hide the splash screen now that we are ready to route
    NativeSplashScreen.hideAsync().catch(() => { });

    // Route based on biometric status
    if (enabled) {
      router.replace(ROUTES.AUTH.FINGERPRINT);
    } else {
      router.replace(ROUTES.AUTH.SIGN_IN);
    }
  }, [assets, isChecking, enabled, router]);

  // Keep returning null while loading so nothing renders underneath the native splash screen
  if (!assets || isChecking) {
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