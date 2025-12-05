import { Stack } from "expo-router";
import { QueryProvider } from "../api/src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
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
            name="user"
            options={{ 
              title : "Usuário",
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
    </QueryProvider>
  );
}
