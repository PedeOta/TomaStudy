import { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useGoogleAuth, useFacebookAuth } from "../hooks/useOAuth";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const google = useGoogleAuth();
  const facebook = useFacebookAuth();

  // LOGIN GOOGLE
  useEffect(() => {
    if (google.response?.type === "success") {
      const token = google.response.authentication?.accessToken;
      console.log("TOKEN GOOGLE:", token);

      router.replace("/(tabs)");
    }
  }, [google.response]);

  // LOGIN FACEBOOK
  useEffect(() => {
    if (facebook.response?.type === "success") {
      const token = facebook.response.authentication?.accessToken;
      console.log("TOKEN FACEBOOK:", token);

      router.replace("/(tabs)");
    }
  }, [facebook.response]);

  function handleLogin() {
    router.replace("/(tabs)");
  }

  return (
    <ImageBackground
      source={require("../assets/images/teladelogin.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.centerContainer}>
        <View style={styles.card}>
          {/* USUÁRIO */}
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="@usuario"
            placeholderTextColor="#777"
            value={usuario}
            onChangeText={setUsuario}
          />

          {/* SENHA */}
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#777"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          {/* BOTÃO ENTRAR */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          {/* GOOGLE */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={google.signIn}
          >
            <Image
              source={require("../assets/images/googleicon.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Entrar com Google</Text>
          </TouchableOpacity>

          {/* FACEBOOK */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={facebook.signIn}
          >
            <Image
              source={require("../assets/images/facebookicon.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Entrar com Facebook</Text>
          </TouchableOpacity>

          {/* LINKS */}
          <TouchableOpacity>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/cadastro")}>
  <Text style={styles.link}>Primeiro acesso?</Text>
</TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  centerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    paddingVertical: 6,
    fontSize: 15,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#006CFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  socialButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    marginLeft: 10,
  },
  socialText: {
    fontSize: 15,
    color: "#000",
  },
  link: {
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
