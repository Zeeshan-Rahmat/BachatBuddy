import { useAssets } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as NativeSplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '@/src/constants/routes';
import { COLORS } from '@/src/constants/theme';
import { useBiometricStore } from '@/src/store/biometricStore';

NativeSplashScreen.preventAutoHideAsync().catch(() => { });

const MIN_SPLASH_DURATION_MS = 2500;

export default function SplashScreen() {
  const { enabled, hasSavedCredentials, isChecking, checkEnabled } = useBiometricStore();
  const [canNavigate, setCanNavigate] = useState(false);
  const { width, height } = useWindowDimensions();
  const logoScale = useSharedValue(0.94);
  const illustrationHeight = Math.min(250, Math.max(180, height * 0.26));

  // 1. Load assets
  const [assets] = useAssets([
    require('../assets/images/logo.png'),
    require('../assets/images/splash-illustration.png'),
  ]);

  // 2. Run the biometric check once when the app mounts
  useEffect(() => {
    checkEnabled();
  }, [checkEnabled]);

  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 700, easing: Easing.out(Easing.quad) }),
        withTiming(0.97, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const isReady = Boolean(assets) && !isChecking;

  // 3. Hide the native splash only when our custom splash is ready to render.
  useEffect(() => {
    if (!isReady) {
      return;
    }

    NativeSplashScreen.hideAsync().catch(() => { });

    const timer = setTimeout(() => {
      setCanNavigate(true);
    }, MIN_SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isReady]);

  // 4. Route only after the custom splash has had time to display.
  useEffect(() => {
    if (!isReady || !canNavigate) {
      return;
    }

    if (enabled && hasSavedCredentials) {
      router.replace(ROUTES.AUTH.FINGERPRINT);
    } else {
      router.replace(ROUTES.AUTH.SIGN_IN);
    }
  }, [isReady, canNavigate, enabled, hasSavedCredentials]);

  // Keep returning null while loading so nothing renders underneath the native splash screen
  if (!isReady) {
    return null;
  }

  return (
    <LinearGradient
      colors={[COLORS.primaryNavy, COLORS.primaryTeal, COLORS.primaryGreen]}
      locations={[0, 0.52, 1]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingBottom: illustrationHeight * 0.35,
            zIndex: 1,
          }}
        >
          <Animated.View
            entering={FadeInDown.duration(550).springify().damping(14)}
            style={{
              width: 152,
              height: 152,
            }}
          >
            <Animated.View
              style={[
                {
                  width: 152,
                  height: 152,
                  borderRadius: 76,
                  backgroundColor: 'rgba(255,255,255,0.96)',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                logoAnimatedStyle,
              ]}
            >
              <Image
                source={require('../assets/images/logo.png')}
                style={{ width: 118, height: 118 }}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(180)}>
            <Text
              className="text-white text-5xl text-center mt-8"
              style={{ fontWeight: '700', letterSpacing: 2.5, lineHeight: 50 }}
            >
              BachatBuddy
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(320)}>
            <Text
              className="text-white/85 text-base text-center mt-2"
              style={{ fontWeight: '600' }}
            >
              Digital Business Tracking System
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.duration(650).delay(220)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width,
            height: illustrationHeight,
            zIndex: 0,
          }}
        >
          <Image
            source={require('../assets/images/splash-illustration.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}
