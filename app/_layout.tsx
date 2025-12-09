import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/firebase';

import { ThemeProvider } from '@/hooks/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'loginscreen',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  if (isLoggedIn === null) {
    // Loading state - você pode retornar um splash screen aqui se desejar
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="trilhas" options={{ presentation: 'card', title: 'Trilhas' }} />
              <Stack.Screen name="html-miniboss" options={{ presentation: 'card', title: 'HTML Miniboss' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="loginscreen" options={{ headerShown: false }} />
              <Stack.Screen name="cadastro" options={{ headerShown: false }} />
              <Stack.Screen name="esqueciasenha" options={{ headerShown: false }} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
