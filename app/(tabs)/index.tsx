import { useTheme } from '@/hooks/theme-context';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.bg }]}>
        <View style={styles.headerTop}>
          <Image
            source={{ uri: "https://i.imgur.com/6VBx3io.png" }} // imagem de perfil genérica
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.welcome, { color: colors.text }]}>Olá, Arthur!</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Pronto pra iniciar sua jornada na programação?</Text>
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
        {/* HTML card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Image source={require("../../assets/images/html.png")} style={styles.iconMain} />
        </View>

        {/* Play button */}
        <TouchableOpacity style={styles.playButton}>
          <View style={styles.playCircle}>
            <Text style={styles.playSymbol}>{'\u25B6'}</Text>
          </View>
          <Text style={styles.playText}>COMEÇAR</Text>
        </TouchableOpacity>

        {/* Locked lessons */}
        <View style={styles.lockedGroup}>
          <Image source={require("../../assets/images/js.png")} style={styles.iconLocked} />
          <Image source={require("../../assets/images/python.png")} style={styles.iconLocked} />
          <Image source={require("../../assets/images/css.png")} style={styles.iconLocked} />
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
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
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
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  iconMain: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  // PLAY BUTTON
  playButton: {
    alignItems: "center",
    marginBottom: 20,
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
  playText: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#4CD964",
  },

  // LOCKED LESSONS
  lockedGroup: {
    alignItems: "center",
    marginTop: 10,
  },
  iconLocked: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    opacity: 0.6,
    marginVertical: 10,
  },

  
});