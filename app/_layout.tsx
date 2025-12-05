import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryProvider } from "../api/src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
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
        </Stack>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
