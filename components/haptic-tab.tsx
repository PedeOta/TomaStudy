import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(PlatformPressable);

export function HapticTab(props: BottomTabBarButtonProps) {
  const translate = useRef(new Animated.Value(0)).current;

  // When the selected state changes, animate the tab up (-8) or down (0).
  React.useEffect(() => {
    const selected = !!props.accessibilityState?.selected;
    Animated.timing(translate, { toValue: selected ? -8 : 0, duration: 200, useNativeDriver: true }).start();
  }, [props.accessibilityState?.selected, translate]);

  const animatedStyle: StyleProp<ViewStyle> = { transform: [{ translateY: translate }] };

  return (
    <AnimatedPressable
      {...props}
      style={[props.style, animatedStyle]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        props.onPressOut?.(ev);
      }}
    >
      {props.children}
    </AnimatedPressable>
  );
}
