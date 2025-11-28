import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function CadastroScreen() {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [usuario, setUsuario] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const senhasIguais = senha.length > 0 && senha === confirmarSenha;

  function handleCadastro() {
    if (!senhasIguais) return;
    router.replace("/"); // Redireciona depois do cadastro
  }

  return (
    <ImageBackground
      source={require("../assets/images/teladelogin.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.centerContainer}>
        <View style={styles.card}>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="José Maria dos Santos"
            placeholderTextColor="#777"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="josemaria@gmail.com"
            placeholderTextColor="#777"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Nome de usuário</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="@josemaria1"
              placeholderTextColor="#777"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />
            {usuario.length > 0 && (
              <Text style={styles.disponivel}>disponível</Text>
            )}
          </View>

          <Text style={styles.label}>Criar senha</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry
              placeholder="********"
              placeholderTextColor="#777"
              value={senha}
              onChangeText={setSenha}
            />
            {senha.length > 0 && senhasIguais && (
              <Text style={styles.sucesso}>as senhas são iguais</Text>
            )}
          </View>

          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry
              placeholder="********"
              placeholderTextColor="#777"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            {confirmarSenha.length > 0 && senhasIguais && (
              <Text style={styles.sucesso}>as senhas são iguais</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.cadastrarButton, !senhasIguais && { opacity: 0.6 }]}
            disabled={!senhasIguais}
            onPress={handleCadastro}
          >
            <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Possuo cadastro ></Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    paddingVertical: 6,
    fontSize: 15,
    marginBottom: 15,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  disponivel: {
    color: "green",
    marginLeft: 8,
    fontWeight: "bold",
  },
  sucesso: {
    color: "green",
    marginLeft: 8,
    fontSize: 12,
  },
  cadastrarButton: {
    backgroundColor: "#006CFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  cadastrarButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: 5,
    color: "#000",
    textDecorationLine: "underline",
  },
});
