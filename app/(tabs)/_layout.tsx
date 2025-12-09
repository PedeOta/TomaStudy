import { Tabs } from 'expo-router';
import React from 'react';

import TabIcon from '@/components/tab-icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f0f0f0',
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
          paddingBottom: 12,
        },
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
