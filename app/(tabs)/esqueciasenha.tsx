import { router } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../src/firebase"; // <-- IMPORT DO FIREBASE

export default function EsqueciSenha() {
	const [identificador, setIdentificador] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleEnviar() {
		if (!identificador.includes("@")) {
			Alert.alert("Erro", "Digite um e-mail válido para recuperar sua senha.");
			return;
		}

		try {
			setLoading(true);

			await sendPasswordResetEmail(auth, identificador);

			Alert.alert(
				"E-mail enviado!",
				"Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada."
			);

			router.push("/loginscreen");
		} catch (error: any) {
			console.log("ERRO AO ENVIAR EMAIL:", error);
			Alert.alert("Erro", error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<ImageBackground
			source={require("../../assets/images/teladelogin.png")}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.centerContainer}>
				<View style={styles.card}>
					<Text style={styles.label}>Esqueci a senha</Text>

					<Text style={[styles.label, { marginTop: 12 }]}>E-mail</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite seu e-mail"
						placeholderTextColor="#777"
						value={identificador}
						onChangeText={setIdentificador}
						autoCapitalize="none"
						keyboardType="email-address"
					/>

					<TouchableOpacity
						style={[styles.loginButton, loading && { opacity: 0.6 }]}
						onPress={handleEnviar}
						disabled={loading}
					>
						<Text style={styles.loginButtonText}>
							{loading ? "Enviando..." : "Enviar instruções"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => router.push("/loginscreen")}>
						<Text style={styles.link}>Voltar para Login</Text>
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
	link: {
		color: "#000",
		textAlign: "center",
		marginTop: 10,
		fontSize: 14,
		textDecorationLine: "underline",
	},
});
