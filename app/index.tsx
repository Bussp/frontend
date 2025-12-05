import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./components/Map";
import { loginSPTrans } from "./scripts/apiSPTrans";

const token = "0ca8c5e730d89985f0076c0fe5bea8ad488d6cbc83b76e70ab715b3d1fa0a35b";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { apiClient } from "../api/src/client";

export default function App() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function init() {
      await loginSPTrans(token);
      
      // Verifica se tem token de autenticação
      const hasToken = apiClient.hasToken();
      
      if (!hasToken) {
        // Se não tem token, redireciona para login
        router.replace("/login");
      } 
      
      setIsChecking(false);
    }

    init();
  }, []);

  // Mostra tela de loading enquanto inicializa
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#0D8694' }}>BU§P</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map/>
    </GestureHandlerRootView>
  );
}
