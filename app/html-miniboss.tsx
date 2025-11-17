import { useTheme } from '@/hooks/theme-context';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HtmlMiniBoss() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>

        <View style={styles.topRow}>
          <View style={styles.heartsRow}>
            <Text style={styles.heart}>❤️</Text>
            <Text style={styles.heart}>❤️</Text>
            <Text style={styles.heart}>❤️</Text>
            <Text style={styles.heart}>❤️</Text>
            <Text style={styles.heart}>❤️</Text>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressFill, { width: '10%' }]} />
            </View>
            <Text style={styles.progressText}>10%</Text>
          </View>
        </View>

        <View style={styles.bubbleContainer}>
          <Text style={[styles.bubbleText, { color: colors.text }]}>HTML significa</Text>
          <Text style={[styles.bubbleQuote, { color: colors.text }]}>“HyperText{`\n`}Markup Language”</Text>
        </View>

        <View style={styles.bossWrap}>
          <Image source={require('../assets/images/htmlboss.png')} style={styles.bossImage} />
        </View>

        <View style={styles.footerSpace} />

        <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.continueText}>CONTINUAR ➜</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, alignItems: 'center' },
  closeButton: { position: 'absolute', left: 18, top: 18, zIndex: 20, backgroundColor: '#eee', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  closeX: { fontSize: 20, color: '#444' },
  topRow: { marginTop: 60, width: '100%', alignItems: 'center' },
  heartsRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  heart: { fontSize: 18 },
  progressWrap: { alignItems: 'center', marginTop: 6 },
  progressBarBg: { width: 220, height: 28, borderRadius: 16, backgroundColor: '#e6e6e6', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7ed957' },
  progressText: { marginTop: 6, color: '#666' },
  bubbleContainer: { marginTop: 26, width: '100%', borderWidth: 2, borderColor: '#21421f', borderRadius: 12, padding: 18, backgroundColor: '#fff' },
  bubbleText: { fontSize: 14, fontWeight: '600' },
  bubbleQuote: { fontSize: 16, fontWeight: '700', marginTop: 6 },
  bossWrap: { marginTop: 26, alignItems: 'center', width: '100%' },
  bossImage: { width: 200, height: 200, resizeMode: 'contain' },
  footerSpace: { height: 40 },
  continueButton: { width: '80%', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, elevation: 3 },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
