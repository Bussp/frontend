import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { RouteIdentifier } from "../api/models/routes.types";
import { fetchBusPositions } from "../mocks/getBuses";
import { Bus, BusState, Coord, detectBusState } from "../scripts/busDetection";
import { getShapeForRoute } from "../scripts/getBusRouteShape";
// import { getShapeForRoute } from "../mocks/getBusRouteShape";
import { checkPermission, watchUserLocation } from "../mocks/getLocation";

import BusesLayer from "./BusesLayer";
import BusStopsLayer from "./BusStopsLayer";
import PolylineLayer from "./PolylineLayer";

// pra testes!! vamo monitorar a linha 84
const monitoredRoutes: RouteIdentifier[] = [
  { bus_line: "8084-10", bus_direction: 1 },
];

export default function Map() {
  const [coords, setCoords] = useState<Coord | null>(null);
  const [isCentered, setIsCentered] = useState(true);

  // rota + estado de o usuário está no onibus ou n
  const [route, setRoute] = useState<Coord[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busState, setBusState] = useState<BusState>({
    insideBus: false,
    busId: null,
    lastBusPosition: null,
    lastUserPosition: null,
    lastTime: null,
    distHistory: Array(10).fill(Infinity),
    distIndex: 0,
    closeCount: 0,
  });

  // refs para garantir que o callback veja os valores atualizados
  const routeRef = useRef<Coord[]>([]);
  const busesRef = useRef<Bus[]>([]);
  const busStateRef = useRef<BusState>(busState);
  const mapRef = useRef<MapView>(null);

  useEffect(() => { routeRef.current = route; }, [route]);
  useEffect(() => { busesRef.current = buses; }, [buses]);
  useEffect(() => { busStateRef.current = busState; }, [busState]);

  // pegar as posicoes dos onibus a cada 1 segundo
  useEffect(() => {
    let interval: NodeJS.Timer;

    const startFetchingBuses = async () => {
      try {
        const busesData = await fetchBusPositions(monitoredRoutes);
        setBuses(busesData);
        interval = setInterval(async () => {
          const busesData = await fetchBusPositions(monitoredRoutes);
          setBuses(busesData);
        }, 1000); // podia ser mais, menos? <- isso é algo a pensar

      } catch (err) {
        console.error("Erro ao buscar posições dos ônibus:", err);
      }
    };
    startFetchingBuses();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // pegar as coordenadas da rota
  useEffect(() => {
      (async () => {
        const routeCoords = await getShapeForRoute(monitoredRoutes[0].bus_line);
        setRoute(routeCoords.points);
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

        const currentRoute = routeRef.current;
        const currentBuses = busesRef.current;

        if (currentRoute.length > 0 && currentBuses.length > 0) {
          const newBusState = detectBusState(busStateRef.current, newCoords, currentBuses, currentRoute);
          busStateRef.current = newBusState;
          setBusState(newBusState);
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


  // imprimir
  useEffect(() => {
    const interval = setInterval(() => {
    }, 5000);
    return () => clearInterval(interval);
  }, [busState]);

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
        <Text style={styles.busStatus}>Dentro do ônibus {busState.busId}</Text>
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
