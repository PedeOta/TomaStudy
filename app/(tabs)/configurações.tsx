import { useTheme } from '@/hooks/theme-context';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ConfiguraçõesScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const router = useRouter();

  // -----------------------------------------------------
  // LIMPAR TODOS OS DADOS LOCAIS (AsyncStorage)
  // -----------------------------------------------------
  const handleClearData = () => {
    Alert.alert(
      "Limpar dados",
      "Tem certeza que deseja apagar todos os dados locais?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Pronto!", "Todos os dados locais foram apagados.");
            } catch (err) {
              Alert.alert("Erro", "Não foi possível limpar os dados.");
            }
          }
        }
      ]
    );
  };

  // -----------------------------------------------------
  // LOGOUT REAL (remove token e volta para login)
  // -----------------------------------------------------
  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja fazer logout?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              router.replace("/login"); // impede voltar para home
            } catch (err) {
              Alert.alert("Erro", "Não foi possível fazer logout.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.header, borderBottomColor: colors.border }
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>⚙️ Configurações</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* NOTIFICAÇÕES */}
        <View classnName={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔔 Notificações</Text>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLabel}>
              <Text style={[styles.settingName, { color: colors.text }]}>Ativar Notificações</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                Receba notificações do app
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLabel}>
              <Text style={[styles.settingName, { color: colors.text }]}>Sons</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                Ativar som das notificações
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={soundEnabled ? '#4CAF50' : '#f4f3f4'}
              disabled={!notificationsEnabled}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLabel}>
              <Text style={[styles.settingName, { color: colors.text }]}>Vibração</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                Vibrar ao receber notificações
              </Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={vibrationEnabled ? '#4CAF50' : '#f4f3f4'}
              disabled={!notificationsEnabled}
            />
          </View>
        </View>

        {/* APARÊNCIA */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Aparência</Text>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLabel}>
              <Text style={[styles.settingName, { color: colors.text }]}>Modo Escuro</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
                Usar tema escuro
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={isDarkMode ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* PRIVACIDADE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔒 Privacidade</Text>

          <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>📋 Política de Privacidade</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]}>
            <Text style={[styles.optionText, { color: colors.text }]}>📄 Termos de Serviço</Text>
          </TouchableOpacity>

          {/* LIMPAR DADOS */}
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.card }]}
            onPress={handleClearData}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>🗑️ Limpar Dados Locais</Text>
          </TouchableOpacity>
        </View>

        {/* SOBRE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ Sobre</Text>

          <View style={[styles.infoItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Versão do App</Text>
            <Text style={[styles.infoValue, { color: colors.secondaryText }]}>1.0.0</Text>
          </View>

          <View style={[styles.infoItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Desenvolvedor</Text>
            <Text style={[styles.infoValue, { color: colors.secondaryText }]}>TomaStudy Team</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <View style={styles.section}>
          <TouchableOpacity
         
          style={styles.dangerButton} onPress={handleLogout}>
            <Text style={styles.dangerButtonText}>🚪 Fazer Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1
  },
  title: {
    fontSize: 28,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 5
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    elevation: 1
  },
  settingLabel: {
    flex: 1,
    marginRight: 12
  },
  settingName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3
  },
  settingDescription: {
    fontSize: 12
  },
  optionButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    elevation: 1
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500'
  },
  infoItem: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500'
  },
  infoValue: {
    fontSize: 14
  },
  dangerButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  }
});
