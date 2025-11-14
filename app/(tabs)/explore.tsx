import { useTheme } from '@/hooks/theme-context';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.bg }]}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: Fonts.rounded,
                color: colors.text,
              },
            ]}>
            Explore
          </Text>
        </View>
        <Text style={[styles.defaultText, { color: colors.text }]}>
          This app includes example code to help you get started.
        </Text>
        <Collapsible title="File-based routing">
          <Text style={[styles.defaultText, { color: colors.text }]}>
            This app has two screens:{' '}
            <Text style={[styles.semiBoldText, { color: colors.text }]}>app/(tabs)/index.tsx</Text> and{' '}
            <Text style={[styles.semiBoldText, { color: colors.text }]}>app/(tabs)/explore.tsx</Text>
          </Text>
          <Text style={[styles.defaultText, { color: colors.text }]}>
            The layout file in <Text style={[styles.semiBoldText, { color: colors.text }]}>app/(tabs)/_layout.tsx</Text>{' '}
            sets up the tab navigator.
          </Text>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <Text style={[styles.linkText, { color: colors.primary }]}>Learn more</Text>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Android, iOS, and web support">
          <Text style={[styles.defaultText, { color: colors.text }]}>
            You can open this project on Android, iOS, and the web. To open the web version, press{' '}
            <Text style={[styles.semiBoldText, { color: colors.text }]}>w</Text> in the terminal running this project.
          </Text>
        </Collapsible>
        <Collapsible title="Images">
          <Text style={[styles.defaultText, { color: colors.text }]}>
            For static images, you can use the <Text style={[styles.semiBoldText, { color: colors.text }]}>@2x</Text> and{' '}
            <Text style={[styles.semiBoldText, { color: colors.text }]}>@3x</Text> suffixes to provide files for
            different screen densities
          </Text>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={{ width: 100, height: 100, alignSelf: 'center' }}
          />
          <ExternalLink href="https://reactnative.dev/docs/images">
            <Text style={[styles.linkText, { color: colors.primary }]}>Learn more</Text>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Light and dark mode components">
          <Text style={[styles.defaultText, { color: colors.text }]}>
            This template has light and dark mode support. The{' '}
            <Text style={[styles.semiBoldText, { color: colors.text }]}>useColorScheme()</Text> hook lets you inspect
            what the user's current color scheme is, and so you can adjust UI colors accordingly.
          </Text>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <Text style={[styles.linkText, { color: colors.primary }]}>Learn more</Text>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Animations">
          <Text style={[styles.defaultText, { color: colors.text }]}>
            This template includes an example of an animated component. The{' '}
            <Text style={[styles.semiBoldText, { color: colors.text }]}>components/HelloWave.tsx</Text> component uses
            the powerful{' '}
            <Text style={[styles.semiBoldText, { color: colors.text, fontFamily: Fonts.mono }]}>
              react-native-reanimated
            </Text>{' '}
            library to create a waving hand animation.
          </Text>
          {Platform.select({
            ios: (
              <Text style={[styles.defaultText, { color: colors.text }]}>
                The <Text style={[styles.semiBoldText, { color: colors.text }]}>components/ParallaxScrollView.tsx</Text>{' '}
                component provides a parallax effect for the header image.
              </Text>
            ),
          })}
        </Collapsible>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  defaultText: {
    fontSize: 16,
    lineHeight: 24,
  },
  semiBoldText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '600',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
