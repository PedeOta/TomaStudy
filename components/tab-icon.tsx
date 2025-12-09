import React, { useEffect, useRef } from 'react';
import { Animated, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  size?: number;
  focused?: boolean;
  style?: StyleProp<ImageStyle>;
};

export default function TabIcon({ source, size = 60, focused = false, style }: Props) {
  const translate = useRef(new Animated.Value(focused ? -8 : 0)).current;

  useEffect(() => {
    Animated.timing(translate, { toValue: focused ? -8 : 0, duration: 180, useNativeDriver: true }).start();
  }, [focused, translate]);

  return (
    <Animated.Image
      source={source}
      style={[{ width: size, height: size, transform: [{ translateY: translate }] }, style]}
      resizeMode="contain"
    />
  );
}
