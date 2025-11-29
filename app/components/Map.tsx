import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Bus, BusState, Coord, detectBusState } from "../scripts/busDetection";
import { fetchBusPositions, Bus } from "../scripts/getBuses";
import { RouteIdentifier } from "../scripts/models/routes.types";
import { getShapeForRoute } from "../scripts/getBusRouteShape";
import { checkPermission, watchUserLocation } from "../scripts/getLocation";

import BusStopsLayer from "./BusStopsLayer";
import PolylineLayer from "./PolylineLayer";
import BusesLayer from "./BusesLayer";

// pra testes!! vamo monitorar a linha 84
const monitoredRoutes: RouteIdentifier[] = [
  { bus_line: "8084-10", bus_direction: 1 },
];

export default function Map() {
  const [coords, setCoords] = useState<Coord | null>(null);
  const [isCentered, setIsCentered] = useState(true);

  const mapRef = useRef<MapView>(null);

  // rota + estado de o usuário está no onibus ou n
  const [route, setRoute] = useState<Coord[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busState, setBusState] = useState<BusState>({
    insideBus: false,
    busId: null,
    lastBusPosition: null,
    lastUserPosition: null,
    lastTime: null,
  });

  // esse userEffect é pra pegar as posicoes dos onibus a cada 5 segundos
  useEffect(() => {
    let interval: NodeJS.Timer;

    const startFetchingBuses = async () => {
      try {
        const busesData = await fetchBusPositions(monitoredRoutes);
        setBuses(busesData);
        interval = setInterval(async () => {
          const busesData = await fetchBusPositions(monitoredRoutes);
          setBuses(busesData);
        }, 5000); // podia ser 1 segundo?

      } catch (err) {
        console.error("Erro ao buscar posições dos ônibus:", err);
      }
    };
    startFetchingBuses();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
      (async () => {
        const routeCoords = await getShapeForRoute(monitoredRoutes[0].bus_line);
        setRoute(routeCoords);
      })();
    }, []);

  const busStopsTest: Coord[] = [
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

        if (route.length > 0 && buses.length > 0) {
          // const newBusState = detectBusState(busState, newCoords, buses, route);
          // setBusState(newBusState)
          // resolvi tirar pq isso n atualiza o estado imediatamente e só enfileira a atualização
          // ent se outro callback do watchUserLocation disparar antes do React aplicar a atualização
          // teriamos um busState desatualizado
          setBusState(prevState => detectBusState(prevState, newCoords, buses, route));
        }
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
        <BusesLayer buses={buses} />
      </MapView>

      {!isCentered && (
        <TouchableOpacity style={styles.recenterButton} onPress={recenter}>
          <Text style={styles.recenterText}>Centralizar</Text>
        </TouchableOpacity>
      )}

      {busState.insideBus && (
        <Text style={styles.busStatus}>Dentro do ônibus{busState.busId}</Text>
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
  busStatus: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: '#38761D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 4,
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
