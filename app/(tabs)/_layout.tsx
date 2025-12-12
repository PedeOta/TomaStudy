import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';

import TabIcon from '@/components/tab-icon';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const tabBarStyle = useMemo(() => ({
    backgroundColor: colors.header ?? Colors[colorScheme ?? 'light'].background,
    borderTopColor: colors.border ?? Colors[colorScheme ?? 'light'].icon,
    borderTopWidth: 1,
    height: 84,
    paddingTop: 8,
    paddingBottom: 12,
  }), [colorScheme, colors]);

  // Debug: show which colorScheme and resolved background are being used.
  // Remove or comment out in production.
  // eslint-disable-next-line no-console
  console.log('[TabLayout] colorScheme=', colorScheme, 'tabBarBg=', tabBarStyle.backgroundColor);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary ?? Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle,
      }}>
      <Tabs.Screen
        name="pomodoro"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/images/iconepomodoro.png')}
              size={60}
              focused={focused}
              style={{ marginTop: 4 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/images/iconehome.png')}
              size={60}
              focused={focused}
              style={{ marginTop: 4 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="configurações"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/images/iconeconfigurações.png')}
              size={60}
              focused={focused}
              style={{ marginTop: 4 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
