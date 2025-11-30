import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
      <Stack>
          <Stack.Screen name="index" options={{ title : "Home" }}/>
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
      </Stack>
  );
}
