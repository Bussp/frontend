import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { getShapeForRoute } from "../scripts/getBusRouteShape";
import { checkPermission, watchUserLocation } from "../scripts/getLocation";
import BusStopsLayer from "./BusStopsLayer";
import PolylineLayer from "./PolylineLayer";

// maybe considerar os mapas do Expo e nao no React Native?
// fica menos parecido com o Google Maps, talvez?
export default function Map() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isCentered, setIsCentered] = useState(true);

  const mapRef = useRef<MapView>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
      (async () => {
        const coords = await getShapeForRoute("5021-10"); // pega o busp como exemplo
        setRoute(coords.points);
      })();
    }, []);
  const busStopsTest = [
    { latitude: 37.448548, longitude: -122.120818 },
    { latitude: 37.409179, longitude: -122.067407 },
  ];

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
        // isso aqui é pra adicionar o ponto atual do user à rota --> n sei se é necessário
        //setRoute((prev) => [...prev, newCoords]);
      });
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // para a tela continuar centralizada quando o usuario se mover
  useEffect(() => {
    if (coords && isCentered && mapRef.current) {
      mapRef.current.animateCamera({
        center: coords,
        zoom: 16,
      });
    }
  }, [coords, isCentered]);

  if (!coords) {
    return <ActivityIndicator size="large"/>;
  }

  function recenter() {
    if (mapRef.current && coords) {
      mapRef.current.animateCamera({
        center: coords,
        zoom: 16,
      });
      setIsCentered(true);
    }
  }

  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={mapStyle}
        zoomEnabled={true}
        zoomControlEnabled={true}
        onPanDrag={() => setIsCentered(false)}
        onRegionChange={(region) => {
          const latDiff = Math.abs(region.latitude - coords.latitude);
          const lonDiff = Math.abs(region.longitude - coords.longitude);
          if (latDiff > 0.001 || lonDiff > 0.001) {
            setIsCentered(false);
          } else {
            setIsCentered(true);
          }
        }}
      >
      <Marker
        coordinate={{
          latitude: coords.latitude,
          longitude: coords.longitude,
        }}>
        <View style={styles.userMarker}/>
      </Marker>
        <PolylineLayer points={route} />
        <BusStopsLayer stops={busStopsTest} />
      </MapView>

      {!isCentered && (
        <TouchableOpacity style={styles.recenterButton} onPress={recenter}>
          <Text style={styles.recenterText}>Centralizar</Text>
        </TouchableOpacity>
      )}
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
  },
  recenterButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 4,
  },
  recenterText: {
    color: "#000",
    fontWeight: "bold",
  },
});

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];
