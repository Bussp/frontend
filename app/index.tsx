import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./components/Map";
import { loginSPTrans } from "./scripts/apiSPTrans";

const token = "0ca8c5e730d89985f0076c0fe5bea8ad488d6cbc83b76e70ab715b3d1fa0a35b";
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function App() {

  useEffect(() => {
    async function init() {
      const auth = await loginSPTrans(token);
    }

    init();
  });

  return (
    <GestureHandlerRootView>
      <Map/>
    </GestureHandlerRootView>
  );
}
