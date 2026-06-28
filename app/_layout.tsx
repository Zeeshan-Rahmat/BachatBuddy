import "@/src/lib/crypto";
import { Stack } from "expo-router";

import "@/global.css";
import { AuthGuard } from "@/src/components/auth/AuthGuard";
import AppDataProvider from "@/src/components/providers/AppDataProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppDataProvider>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
          </AuthGuard>
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
