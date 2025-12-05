import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { loginSPTrans } from "../scripts/apiSPTrans";
import Map from "./components/Map";

const token = "0ca8c5e730d89985f0076c0fe5bea8ad488d6cbc83b76e70ab715b3d1fa0a35b";

export default function App() {
  useEffect(() => {
    loginSPTrans(token);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map/>
    </GestureHandlerRootView>
  );
}
