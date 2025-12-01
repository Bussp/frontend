import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
      </Stack>
  );
}
