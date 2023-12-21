import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { SessionProvider } from '../api/firebaseAuthentication/client';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Alata: require('../assets/fonts/Alata-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarColor: Colors.dark.mainColorDark }} />
        <Stack.Screen name="modals/actionModal" options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop'}}/>
        <Stack.Screen name="modals/logInModal" options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop'}}/>
        <Stack.Screen name="screens/settingsScreen" options={{ headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop'}} />
        <Stack.Screen name="screens/aboutScreen" options={{ headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop'}} />
        <Stack.Screen name="screens/accountScreen" options={{ headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop'}} />
        <Stack.Screen name="screens/authentificationScreen" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop'}} />
      </Stack>
    </ThemeProvider>
    </SessionProvider>
  );
}
