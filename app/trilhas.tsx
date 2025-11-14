import { useTheme } from '@/hooks/theme-context';
import { StyleSheet, Text, View } from 'react-native';

export default function TrilhasScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Trilhas</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Tela de trilhas (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
});
