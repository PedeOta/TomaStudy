import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../src/firebase";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const senhaValida = senha.length >= 6;
  const confirmarSenhaValida = confirmarSenha.length >= 6;
  const senhasIguais = senhaValida && confirmarSenhaValida && senha === confirmarSenha;

  async function handleCadastro() {
    console.log("🔵 handleCadastro iniciado");

    if (!nome || !email || !usuario || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (!senhaValida) {
      Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!senhasIguais) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      console.log("🟡 Criando usuário no Firebase Auth...");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      const user = userCredential.user;
      console.log("🟢 Usuário criado com UID:", user.uid);

      // 🔥 Salvar no Firestore sem bloquear o fluxo
      setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
        usuario,
        criadoEm: new Date(),
      })
        .then(() => console.log("🟢 Dados salvos no Firestore"))
        .catch((err) =>
          console.log("⚠️ Erro ao salvar no Firestore (não bloqueou):", err)
        );

      console.log("🟣 Redirecionando para tela de login");
      router.replace("/loginscreen");

    } catch (error: any) {
      console.log("❌ ERRO NO CADASTRO:", error);

      let mensagemErro = "Erro ao cadastrar.";

      if (error.code === "auth/email-already-in-use") {
        mensagemErro = "Email já cadastrado!";
      }

      Alert.alert("Atenção", mensagemErro);
    } finally {
      setCarregando(false);
    }
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
            placeholder="exemplo@gmail.com"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Nome de usuário</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="@fulano123"
              placeholderTextColor="#777"
              value={usuario}
              onChangeText={setUsuario}
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
            {senha.length > 0 && !senhaValida && (
              <Text style={styles.erro}>mínimo 6 caracteres</Text>
            )}
            {senhaValida && confirmarSenhaValida && senhasIguais && (
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
            {confirmarSenha.length > 0 && !confirmarSenhaValida && (
              <Text style={styles.erro}>mínimo 6 caracteres</Text>
            )}
            {senhaValida && confirmarSenhaValida && senhasIguais && (
              <Text style={styles.sucesso}>as senhas são iguais</Text>
            )}
          </View>

          {/* 🔥 Botão só habilita quando senha >=6 E senhas iguais */}
          <TouchableOpacity
            style={[
              styles.cadastrarButton,
              (!senhasIguais || !senhaValida || carregando) && { opacity: 0.5 },
            ]}
            disabled={!senhasIguais || !senhaValida || carregando}
            onPress={handleCadastro}
          >
            <Text style={styles.cadastrarButtonText}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </Text>
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
  background: { flex: 1 },
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
  row: { flexDirection: "row", alignItems: "center" },
  disponivel: { color: "green", marginLeft: 8, fontWeight: "bold" },
  sucesso: { color: "green", marginLeft: 8, fontSize: 12 },
  erro: { color: "red", marginLeft: 8, fontSize: 12 },
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
