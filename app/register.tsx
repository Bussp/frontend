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
import { useRegister } from "../api/src/hooks/useUsers";

export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = () => {
    // Validações básicas
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Por favor, preencha o nome");
      return;
    }

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

    // Senha mínima
    if (formData.password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Fazer o registro
    register(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Sucesso",
            "Conta criada com sucesso! Faça login para continuar.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/login"),
              },
            ]
          );
        },
        onError: (error: any) => {
          let errorMessage = "Erro ao criar conta. Tente novamente.";
          
          // Traduz mensagens de erro comuns do backend
          const detail = error?.response?.data?.detail || error?.message || "";
          
          if (detail.includes("already exists")) {
            errorMessage = "Usuário com este email já existe.";
          } else if (detail.includes("Invalid email")) {
            errorMessage = "Email inválido.";
          } else if (detail.includes("password")) {
            errorMessage = "Senha inválida. Use pelo menos 6 caracteres.";
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
          <Text style={styles.subtitle}>Registrar</Text>

          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) =>
                setFormData({ ...formData, name: text })
              }
              autoCapitalize="words"
              editable={!isPending}
            />
          </View>

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

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
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

          {/* Botão Registrar */}
          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para Login */}
          <TouchableOpacity
            onPress={() => router.push("/login" as any)}
            disabled={isPending}
          >
            <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
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
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#0D8694",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
