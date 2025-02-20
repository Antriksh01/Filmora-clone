import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();

  // Load fonts
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    outfitBold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  return <Stack screenOptions={{ headerShown: false }} />;
}
