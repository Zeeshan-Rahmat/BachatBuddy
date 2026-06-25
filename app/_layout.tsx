import { Stack } from "expo-router";

import "@/global.css";
import AppDataProvider from "@/src/components/providers/AppDataProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppDataProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
