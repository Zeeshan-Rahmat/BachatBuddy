// import { useFonts } from "expo-font";
import { Stack } from "expo-router";
// import { useEffect } from "react";

import "@/global.css";

export default function RootLayout() {

  // const [fontsLoaded] = useFonts({
  //   "sans-light": require("../assets/fonts/Inter-Light.ttf"),
  //   "sans-regular": require("../assets/fonts/Inter-Regular.ttf"),
  //   "sans-medium": require("../assets/fonts/Inter-Medium.ttf"),
  //   "sans-semiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  //   "sans-bold": require("../assets/fonts/Inter-Bold.ttf"),
  //   "sans-extraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
  // });

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync()
  //   }

  // }, [fontsLoaded])

  // if (!fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
