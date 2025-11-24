import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider } from '@/hooks/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          
          {/* ROTA INICIAL */}
          <Stack.Screen name="index" />

          {/* LOGIN */}
          <Stack.Screen name="loginScreen" />

          {/* SUAS ABAS */}
          <Stack.Screen name="(tabs)" />

          {/* OUTRAS TELAS */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="trilhas" options={{ presentation: 'card', title: 'Trilhas' }} />
        </Stack>

        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
