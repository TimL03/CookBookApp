import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { SessionProvider } from '../api/firebaseAuthentication/client';
import { InvitationProvider } from '../api/firebaseRecipeInvitations/client';

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
      <InvitationProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarColor: Colors.dark.mainColorDark }} />
            <Stack.Screen name="modals/actionModal" options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="screens/viewRecipeScreen" options={{ navigationBarColor: Colors.dark.mainColorDark, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="screens/addRecipeScreen" options={{ navigationBarColor: Colors.dark.background, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="modals/shareRecipeModal" options={{ navigationBarColor: Colors.dark.background, headerShown: false, presentation: 'transparentModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="screens/settingsScreen" options={{ navigationBarColor: Colors.dark.background, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="screens/aboutScreen" options={{ navigationBarColor: Colors.dark.background, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="screens/accountScreen" options={{ navigationBarColor: Colors.dark.background, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="screens/authentificationScreen" options={{ navigationBarColor: Colors.dark.background, headerShown: false, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="modals/logInModal" options={{ navigationBarColor: Colors.dark.background, headerShown: false, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="modals/showSharedRecipeInvitation" options={{ navigationBarColor: Colors.dark.background, headerShown: false, presentation: 'transparentModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="modals/viewRandomRecipeModal" options={{ navigationBarColor: Colors.dark.background, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="modals/viewFeedRecipeModal" options={{ navigationBarColor: Colors.dark.background, headerShown: true, presentation: 'fullScreenModal', animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }} />
          </Stack>
        </ThemeProvider>
      </InvitationProvider>
    </SessionProvider>
  );
}
