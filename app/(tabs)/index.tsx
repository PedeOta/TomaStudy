import { useTheme } from '@/hooks/theme-context';
import { useUser } from '@/hooks/user-context';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function App() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useUser();
  const isFocused = useIsFocused(); // Hook para detectar quando o usuário volta para esta tela

  const [pythonUnlocked, setPythonUnlocked] = useState(false);

  const displayName =
    user?.nome ||
    (user?.email ? user.email.split('@')[0] : null) ||
    user?.uid ||
    null;

  // Carrega o progresso toda vez que a tela ganha foco
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const htmlDone = await AsyncStorage.getItem('HTML_COMPLETED');
        setPythonUnlocked(htmlDone === 'true');
      } catch (e) {
        console.error("Erro ao carregar progresso:", e);
      }
    };
    loadProgress();
  }, [isFocused]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.bg }]}>
        <View style={styles.headerTop}>
          <Image
            source={{ uri: 'https://i.imgur.com/6VBx3io.png' }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.welcome, { color: colors.text }]}>
              {displayName ? `Olá, ${displayName}!` : 'Carregando usuário...'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Pronto pra iniciar sua jornada na programação?
            </Text>
          </View>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.main}>

        {/* TRILHA HTML (Sempre Aberta) */}
        <View style={[styles.cardRow, { justifyContent: 'flex-start' }]}>
          <View style={styles.cardWithButton}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Image
                source={require('../../assets/images/html.png')}
                style={styles.iconMain}
              />
            </View>

            <TouchableOpacity
              style={styles.playButtonOverlay}
              onPress={() => router.push('/html-miniboss')}
            >
              <View style={styles.playCircle}>
                <Text style={styles.playSymbol}>▶</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* TRILHA PYTHON (Libera após vitória no HTML) */}
        <View style={[styles.cardRow, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity
            disabled={!pythonUnlocked}
            onPress={() => router.push('/python')}
            activeOpacity={0.8}
          >
            <View 
              style={[
                styles.card, 
                // Lógica de transparência: se liberado, fundo transparente + borda cinza
                pythonUnlocked 
                  ? styles.cardUnlocked 
                  : { backgroundColor: colors.card }
              ]}
            >
              <Image
                source={
                  pythonUnlocked
                    ? require('../../assets/images/pythonliberado.png') // Colorida e sem cadeado
                    : require('../../assets/images/python.png')         // Cinza/Bloqueada
                }
                style={styles.iconMain}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* TRILHA JAVASCRIPT */}
        <View style={[styles.cardRow, { justifyContent: 'flex-start' }]}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image
              source={require('../../assets/images/js.png')}
              style={styles.iconMain}
            />
          </View>
        </View>

        {/* TRILHA CSS */}
        <View style={[styles.cardRow, { justifyContent: 'flex-end' }]}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image
              source={require('../../assets/images/css.png')}
              style={styles.iconMain}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    paddingTop: 50, 
    paddingHorizontal: 20,
    paddingBottom: 10 
  },
  headerTop: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10 
  },
  welcome: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 12, 
    marginTop: 2 
  },

  main: { 
    paddingVertical: 20 
  },
  cardRow: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 12,
    flexDirection: 'row',
  },
  cardWithButton: { 
    position: 'relative' 
  },
  card: {
    borderRadius: 100, // Torna o botão redondo
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    // Sombra padrão para cards preenchidos
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // ESTILO ESPECÍFICO PARA O PYTHON LIBERADO (TRANSPARENTE + BORDA)
  cardUnlocked: {
    backgroundColor: 'transparent', // Fundo interno transparente
    borderWidth: 8,                // Borda grossa estilo o botão original
    borderColor: '#E0E0E0',        // Cinza claro das bordas
    elevation: 0,                  // Remove sombra para destacar o efeito vazado
    shadowOpacity: 0,
  },

  iconMain: { 
    width: 105, 
    height: 105, 
    resizeMode: 'contain' 
  },

  playButtonOverlay: { 
    position: 'absolute', 
    bottom: -10, 
    right: -10 
  },
  playCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playSymbol: { 
    color: '#fff', 
    fontSize: 30, 
    marginLeft: 4 
  },
});