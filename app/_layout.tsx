// import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import "@/global.css";

export default function RootLayout() {

  // const [fontsLoaded] = useFonts({
  //   "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
  //   "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
  //   "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
  //   "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
  //   "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  //   "Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
  // });



  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
