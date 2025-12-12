import { useTheme } from '@/hooks/theme-context';
import { useUser } from '@/hooks/user-context';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useUser();

  // Agora NÃO existe mais fallback "Arthur"
  const displayName =
    user?.nome ||
    (user?.email ? user.email.split('@')[0] : null) ||
    user?.uid ||
    null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.bg }]}>
        <View style={styles.headerTop}>
          <Image
            source={{ uri: "https://i.imgur.com/6VBx3io.png" }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.welcome, { color: colors.text }]}>
              {displayName ? `Olá, ${displayName}!` : "Carregando usuário..."}
            </Text>

            {/* Subtítulo */}
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Pronto pra iniciar sua jornada na programação?
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/992/992703.png" }}
              style={styles.iconSmall}
            />
            <Text style={[styles.statsText, { color: colors.text }]}>0 XP</Text>
          </View>

          <View style={styles.statsItem}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/833/833472.png" }}
              style={styles.iconSmall}
            />
            <Text style={[styles.statsText, { color: colors.text }]}>5</Text>
          </View>
        </View>
      </View>

      {/* MAIN */}
      <ScrollView contentContainerStyle={styles.main}>

        {/* HTML card LEFT */}
        <View style={[styles.cardRow, { justifyContent: 'flex-start' }]}>
          <View style={styles.cardWithButton}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Image source={require("../../assets/images/html.png")} style={styles.iconMain} />
            </View>

            <TouchableOpacity
              style={styles.playButtonOverlay}
              onPress={() => router.push('/html-miniboss')}
            >
              <View style={styles.playCircle}>
                <Text style={styles.playSymbol}>{'\u25B6'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* JS card RIGHT */}
        <View style={[styles.cardRow, { justifyContent: 'flex-end' }]}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image source={require("../../assets/images/js.png")} style={styles.iconMain} />
          </View>
        </View>

        {/* Python card LEFT */}
        <View style={[styles.cardRow, { justifyContent: 'flex-start' }]}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image source={require("../../assets/images/python.png")} style={styles.iconMain} />
          </View>
        </View>

        {/* CSS card RIGHT */}
        <View style={[styles.cardRow, { justifyContent: 'flex-end' }]}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image source={require("../../assets/images/css.png")} style={styles.iconMain} />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // HEADER
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -40,
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  iconSmall: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  statsText: {
    fontWeight: "bold",
    fontSize: 12,
  },

  // MAIN
  main: {
    paddingVertical: 20,
  },
  cardRow: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 12,
    flexDirection: "row",
  },
  cardWithButton: {
    position: "relative",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: 140,
    height: 140,
  },
  iconMain: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  playButtonOverlay: {
    position: "absolute",
    bottom: -10,
    right: -10,
    zIndex: 10,
  },
  playCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4CD964",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  playSymbol: {
    color: "#fff",
    fontSize: 30,
    marginLeft: 4,
  },
});
