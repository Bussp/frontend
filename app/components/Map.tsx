import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useRouteShapes } from "../../api/src/hooks/useRoutes";
import { Bus, BusState, Coord } from "../../models/buses";
import { detectBusState } from "../../scripts/busDetection";
import { fetchBusDetails, fetchBusPositions } from "../../scripts/getBuses";
import { checkPermission, watchUserLocation } from "../../scripts/getLocation";

import { useRouter } from "expo-router";
import BottomSheetMenu from "./BottomSheetMenu";
import BusesLayer from "./BusesLayer";
import BusStopsLayer from "./BusStopsLayer";
import PolylineLayer from "./PolylineLayer";

export default function Map() {
  const [coords, setCoords] = useState<Coord | null>(null);
  const [isCentered, setIsCentered] = useState(true);

  // rota + estado de o usuário está no onibus ou n
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [currentDirection, setCurrentDirection] = useState<number>(1);
  const [route, setRoute] = useState<Coord[]>([]);
  const [stops, setStops] = useState<Coord[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busState, setBusState] = useState<BusState>({
    insideBus: false,
    busId: null,
    lastBusPosition: null,
    lastUserPosition: null,
    lastTime: null,
    distHistory: Array(10).fill(Infinity), // <-- esse "10" é ajustável, tem q arrumar de acordo com a necessidade
    distIndex: 0,
    closeCount: 0,
  });

  // Use the hook to fetch route shapes
  const routeIdentifiers = currentLine 
    ? [{ bus_line: currentLine, bus_direction: currentDirection }]
    : [];
  const { data: shapesData } = useRouteShapes(routeIdentifiers, {
    enabled: !!currentLine
  });

  // refs para garantir que o callback veja os valores atualizados
  const routeRef = useRef<Coord[]>([]);
  const busesRef = useRef<Bus[]>([]);
  const stopsRef = useRef<Coord[]>([]);
  const busStateRef = useRef<BusState>(busState);
  const mapRef = useRef<MapView>(null);

  useEffect(() => { routeRef.current = route; }, [route]);
  useEffect(() => { busesRef.current = buses; }, [buses]);
  useEffect(() => { stopsRef.current = stops; }, [stops]);
  useEffect(() => { busStateRef.current = busState; }, [busState]);

  // pegar as posicoes dos onibus a cada 1 segundo
  useEffect(() => {
    if (!currentLine) {
      setBuses([]);
      setRoute([]);
      return;
    }

    // Update route when shapes data is available
    if (shapesData?.shapes && shapesData.shapes.length > 0) {
      setRoute(shapesData.shapes[0].points);
    }

    let interval: ReturnType<typeof setInterval>;
    const startFetchingBuses = async () => {

      try {
        // é melhor pegar os detalhes da rota 1 vez
        // e dai ficar pegando as posições do onibus varias vezes
        const details = await fetchBusDetails(currentLine, currentDirection);
        if (!details) {
          console.error("Não foi possível obter detalhes da linha");
          return;
        }

        // po bem aqui q tem q fazer o fetch das paradas de ônibus
        // finge q eu fiz algo do tipo const collectedBusStops = await fetchBusStops(details);
        const collectedBusStops: Coord[] = [ { latitude: 37.448548, longitude: -122.120818 },{ latitude: 37.409179, longitude: -122.067407 },];
        setStops(collectedBusStops);

        const initialPositions = await fetchBusPositions(details);
        setBuses(initialPositions);

        interval = setInterval(() => { 
          (async () => {
            try {
              const updatedPositions = await fetchBusPositions(details);
              setBuses(updatedPositions);
            } catch (err) {
              console.error("Erro ao atualizar posições dos ônibus:", err);
              // Continua mesmo com erro, tentará novamente no próximo intervalo
            }
          })();
        }, 5000); // Aumentado de 1s para 5s para reduzir carga no servidor

      } catch (err) {
        console.error("Erro ao buscar posições dos ônibus:", err);
      }
    };
    startFetchingBuses();
    return () => {
      if (interval) clearInterval(interval);
    };
  
  }, [currentLine, currentDirection, shapesData]);

  // NOTA!! a variável booleana busState.insideBus é que informa se o cara tá dentro ou nao do bus
  // usar isso pra calcular distancia percorrida, tempo de viagem, etc etc
  // talvez ela precise de uns ajustes de constantes dentro do app/scripts/busDetection.
  // em particular a quantas posições passadas nos preocuparemos (no momento são 10)
  // e em quantos por cento do tempo o user precisa estar perto do bus pra contar (no momento são 40%)

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

  const router = useRouter();

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
        {currentLine!== null && <BusStopsLayer stops={stops} />}
        {currentLine!==null && <BusesLayer line={currentLine} buses={buses} />}
      </MapView>

      {!isCentered && (
        <TouchableOpacity style={styles.recenterButton} onPress={recenter}>
          <Text 
            style={styles.recenterText}>Centralizar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.absoluteButtons, styles.communityButton]}
        onPress={() => router.navigate('/ranking')}>
          <FontAwesome name="users" size={20} color="black"/>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.absoluteButtons, styles.profileButton]}
        onPress={() => router.navigate('/user' as any)}>
          <FontAwesome name="user" size={20} color="black"/>
      </TouchableOpacity>

      <BottomSheetMenu {...{setCurrentLine}}/>

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
  absoluteButtons: {
    position: "absolute",
    backgroundColor: "white",
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    elevation: 4,
  },
  recenterButton: {
    top: 40,
    right: 20,
  },
  profileButton: {
    top: 40,
    right: 20, 
  },
  communityButton: {
    top: 40,
    right: 70, 
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
