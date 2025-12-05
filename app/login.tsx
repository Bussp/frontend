import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "../api/src/hooks/useUsers";
import { useAuth } from "../api/src/providers/AuthProvider";
import { getCurrentUser } from "../api/src/requests/users";

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    // Validações básicas
    if (!formData.email.trim()) {
      Alert.alert("Erro", "Por favor, preencha o email");
      return;
    }

    if (!formData.password.trim()) {
      Alert.alert("Erro", "Por favor, preencha a senha");
      return;
    }

    // Email básico validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    // Fazer o login
    login(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: async () => {
          console.log("[LOGIN] Login bem-sucedido!");
          
          // Busca os dados do usuário e atualiza o contexto
          try {
            const userData = await getCurrentUser();
            setUser(userData);
            router.replace("/");
          } catch (error: any) {
            console.error("Erro ao buscar dados do usuário:", error);
            
            // Verifica se é erro de rede
            if (error?.message?.includes("Network request failed")) {
              Alert.alert(
                "Erro de Conexão",
                "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e se o backend está rodando.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/"),
                  },
                ]
              );
            } else {
              Alert.alert(
                "Erro",
                "Não foi possível carregar os dados do usuário. Tente novamente.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/"),
                  },
                ]
              );
            }
          }
        },
        onError: (error: any) => {
          let errorMessage = "Email ou senha incorretos. Tente novamente.";
          
          // Traduz mensagens de erro comuns do backend
          const detail = error?.response?.data?.detail || error?.message || "";
          
          if (detail.includes("Invalid credentials") || detail.includes("Incorrect")) {
            errorMessage = "Email ou senha incorretos.";
          } else if (detail.includes("not found") || detail.includes("does not exist")) {
            errorMessage = "Usuário não encontrado.";
          } else if (detail.includes("Invalid email")) {
            errorMessage = "Email inválido.";
          } else if (detail.includes("disabled") || detail.includes("inactive")) {
            errorMessage = "Conta desabilitada.";
          } else if (detail) {
            errorMessage = detail;
          }
          
          Alert.alert("Erro", errorMessage);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>BU§P</Text>
          <Text style={styles.subtitle}>Login</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isPending}
            />
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isPending}
            />
          </View>

          {/* Botão Login */}
          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Botão Criar conta */}
          <TouchableOpacity
            style={[styles.buttonSecondary, isPending && styles.buttonDisabled]}
            onPress={() => router.push("/register" as any)}
            disabled={isPending}
          >
            <Text style={styles.buttonSecondaryText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0D8694",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#F5A623",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
