import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../api/src/providers/AuthProvider";
import { QueryProvider } from "../api/src/providers/QueryProvider";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'login' || segments[0] === 'register';

    console.log(isAuthenticated, inAuthGroup);

    if (!isAuthenticated && !inAuthGroup) {
      // Redireciona para login se não estiver autenticado
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redireciona para home se já estiver autenticado
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0D8694" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title : "Home",
            headerShown : false
          }}/>
        <Stack.Screen 
          name="ranking"
          options={{ 
            title : "Ranking",
            headerStyle: {
              backgroundColor: "#0D8694",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: "center"
          }}/>
        <Stack.Screen 
          name="profile"
          options={{ 
            title : "Perfil",
            headerStyle: {
              backgroundColor: "#0D8694",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: "center"
          }}/>
        <Stack.Screen 
          name="login"
          options={{ 
            title : "Login",
            headerShown: false,
          }}/>
        <Stack.Screen 
          name="register"
          options={{ 
            title : "Registrar",
            headerShown: false,
          }}/>
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryProvider>
  );
}
