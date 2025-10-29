import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EstatisticasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Tela de Estatísticas</Text>
      <Text style={styles.subtitle}>Seu progresso, XP e streak de dias.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});