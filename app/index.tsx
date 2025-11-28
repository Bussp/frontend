import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./components/Map";

export default function App() {
  return (
    <GestureHandlerRootView>
      <Map/>
    </GestureHandlerRootView>
  );
}
