import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { checkPermission, watchUserLocation } from "./scripts/getLocation";

// maybe considerar os mapas do Expo e nao no React Native?
// fica menos parecido com o Google Maps, talvez?
export default function App() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let subscription: any;

    (async () => {
      const ok = await checkPermission();
      if (!ok) {
        alert("Permissão negada");
        return;
      }

      subscription = await watchUserLocation((newCoords) => {
        setCoords(newCoords);
      });
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  if (!coords) {
    return <ActivityIndicator size="large"/>;
  }


  return (
    <View style={styles.container}>

      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
          <Marker
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
          >
            <View style={styles.userMarker}/>
          </Marker>

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  userMarker: {
    backgroundColor: '#33BBFF',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  }
});
