import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';

import FontAwesome from '@expo/vector-icons/FontAwesome';


import { useRouteShapes } from "../../api/src/hooks/useRoutes";
import { BusPositionsRequest, RouteShapesRequest } from "../../api/src/models/routes.types";
import { getBusPositions, getRouteShapes, searchRoutes } from "../../api/src/requests/routes";
import { Bus, BusState, Coord } from "../../models/buses";
import { computeScore, detectBusState, startScoring, stopScoring } from "../../scripts/busDetection";
import { checkPermission, watchUserLocation } from "../../scripts/getLocation";

import type { CreateTripRequest } from "../../api/src/models/trips.types";
import { createTrip } from "../../api/src/requests/trips";


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
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const [route, setRoute] = useState<Coord[]>([]);
  const [stops, setStops] = useState<Coord[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busState, setBusState] = useState<BusState>({
    currentLine: null,
    insideBus: false,
    scoring: false,
    entryPosition: null,
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


  // essa função é a q calcula score. ele muda o estado do busStateRef.current e do busState e envia a mensagem para o back
  async function finishScoring(
    reason: string,
    routeForScore?: Coord[],
    userPosition?: Coord,
    currentLine?: string,
  ) {
    if (!busStateRef.current.scoring) {
      return;
    }
  
    const effectiveRoute = routeForScore ?? routeRef.current;
    const effectiveCoords = userPosition ?? coords;
  
    if (!effectiveCoords || effectiveRoute.length === 0) {
      // não temos dados suficientes pra pontuar
      return;
    }
  
    // 1) Calcula o score localmente
    const localScore = computeScore(
      busStateRef.current,
      effectiveRoute,
      effectiveCoords,
    );
  
    // 2) Monta o payload da viagem
    //    Aqui estou assumindo que a "rota" da viagem é a linha/direção atuais
    //    (se você quiser, dá pra guardar isso dentro do próprio BusState na hora do startScoring).
    let apiScore = localScore;
  
    try {
      if (currentLine) {
        const payload: CreateTripRequest = {
          route: {
            // Ajusta se o tipo RouteIdentifier tiver outro formato
            bus_line: currentLine,
            bus_direction: currentDirection,
          },
          // OBS: por enquanto estou usando o score como "distance",
          //      porque o tipo da API não tem campo score.
          //      Quando você tiver a distância real, troca aqui.
          distance: localScore,
          trip_datetime: new Date().toISOString(),
        };
  
        const response = await createTrip(payload);
        apiScore = response.score;
      }
  
      // 3) Mostra a mensagem usando o score que veio da API (se deu certo) ou o local
      alert(`Viagem finalizada (${reason})! Você ganhou ${apiScore} pontos.`);
    } catch (err) {
      console.error("Erro ao salvar viagem no backend:", err);
      // fallback: pelo menos mostra o score local
      alert(`Viagem finalizada (${reason})! Você ganhou ${localScore} pontos.`);
    }
  
    // 4) Para a pontuação localmente
    const stopped = stopScoring(busStateRef.current);
    busStateRef.current = stopped;
    setBusState(stopped);
  }
  
  

  useEffect(() => { routeRef.current = route; }, [route]);
  useEffect(() => { busesRef.current = buses; }, [buses]);
  useEffect(() => { stopsRef.current = stops; }, [stops]);
  useEffect(() => { busStateRef.current = busState; }, [busState]);

  
  useEffect(() => {
    if (!currentLine) {
      // se vc desmarcou a linha conta o score
      if(busStateRef.current.scoring){
        finishScoring("linha desmarcada", routeRef.current, coords ?? undefined, busStateRef.current.currentLine ?? undefined);

      }
      setBuses([]);
      setRoute([]);
      return;
    }

    // se currentline mudou enquanto pontuava, computar a pontuação final
    // basicamente quando vc pega um onibus e esta pontuando, se vc trocar de onibus vai contar o score
    if(busStateRef.current.scoring && busStateRef.current.currentLine && busStateRef.current.currentLine != currentLine){
      finishScoring("mudança de linha", routeRef.current, coords ?? undefined, busStateRef.current.currentLine ?? undefined);

    }
    busStateRef.current.currentLine = currentLine;
  
    let interval: ReturnType<typeof setInterval>;
  
    const startFetchingBuses = async () => {
      try {
        // 1) Buscar detalhes da rota no backend
        const searchResp = await searchRoutes(currentLine);
        const routeMatch =
          searchResp.routes.find(
            (r) => r.route.bus_direction === currentDirection
          ) ?? searchResp.routes[0];
  
        if (!routeMatch) {
          console.error("Não foi possível obter detalhes da linha");
          return;
        }
  
        // 2) Buscar shape da rota
        const shapesReq: RouteShapesRequest = {
          routes: [routeMatch.route],
        };
        const shapesResp = await getRouteShapes(shapesReq);
  
        if (shapesResp.shapes && shapesResp.shapes.length > 0) {
          setRoute(shapesResp.shapes[0].points as Coord[]);
        } else {
          setRoute([]);
        }
  
        // 3) Buscar posições iniciais dos ônibus
        const posReq: BusPositionsRequest = {
          routes: [{ route_id: routeMatch.route_id }],
        };
        const initialPositions = await getBusPositions(posReq);
        setBuses(
          initialPositions.buses.map((b, index) => ({
            // id único: linha + sentido + índice + posição
            id: `${routeMatch.route.bus_line}-${routeMatch.route.bus_direction}-${index}-${b.position.latitude}-${b.position.longitude}`,
            type: routeMatch.route.bus_direction,
            position: {
              latitude: b.position.latitude,
              longitude: b.position.longitude,
            },
          }))
        );
  
        // 4) Atualizar posições dos ônibus a cada 5 segundos
        interval = setInterval(async () => {
          try {
            const updated = await getBusPositions(posReq);
            setBuses(
              updated.buses.map((b, index) => ({
                id: `${routeMatch.route.bus_line}-${routeMatch.route.bus_direction}-${index}-${b.position.latitude}-${b.position.longitude}`,
                type: routeMatch.route.bus_direction,
                position: {
                  latitude: b.position.latitude,
                  longitude: b.position.longitude,
                },
              }))
            );
          } catch (err: any) {
            // Só loga erros que não sejam de rede ou timeout
            const isNetworkError = err?.message?.includes('Network Error') || 
                                  err?.message?.includes('Network request failed') ||
                                  err?.message?.includes('timeout');
            
            if (!isNetworkError) {
              console.error("Erro ao atualizar posições dos ônibus:", err);
            }
            
            // Se for erro de autenticação (401), limpa o intervalo
            if (err?.response?.status === 401) {
              console.log("Token inválido, parando busca de ônibus");
              if (interval) clearInterval(interval);
            }
          }
        }, 5000); // Atualiza a cada 5 segundos
  
      } catch (err: any) {
        // Só loga se não for erro de rede
        const isNetworkError = err?.message?.includes('Network Error') || 
                              err?.message?.includes('Network request failed') ||
                              err?.message?.includes('timeout');
        
        if (!isNetworkError) {
          console.error("Erro ao buscar rota/posições dos ônibus:", err);
        }
      }
    };
  
    startFetchingBuses();
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentLine, currentDirection]);
  

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
        const prevBusState = busStateRef.current;
  
        // Se não temos rota ou ônibus, não dá pra detectar nada direito
        if (currentRoute.length === 0 || currentBuses.length === 0) {
          return;
        }
  
        // 1) Detecta o estado atual (dentro/fora, qual ônibus, etc.)
        const detectedState = detectBusState(
          prevBusState,
          newCoords,
          currentBuses,
          currentRoute,
        );
  
        // 2) Transição: estava DENTRO e agora está FORA -> saiu do ônibus
        if (
          prevBusState.insideBus &&
          !detectedState.insideBus &&
          prevBusState.scoring
        ) {
          // aqui você delega TUDO pra finishScoring:
          // - computar score
          // - chamar stopScoring
          // - atualizar busStateRef.current
          // - chamar setBusState
          finishScoring("saída do ônibus", currentRoute, newCoords, prevBusState.currentLine ?? undefined);
          return;
        }
  
        // 3) Caso normal: só atualiza estado com o detectedState
        busStateRef.current = detectedState;
        setBusState(detectedState);
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

  function handleStartScoring() {
    if (!coords || route.length === 0) {
      return;
    }
    alert("Iniciando pontuação no ônibus!");
    setBusState((prev) => startScoring(prev, route, coords));
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
        onPress={() => router.navigate('/profile')}>
          <FontAwesome name="user" size={20} color="black"/>
      </TouchableOpacity>

      <BottomSheetMenu {...{setCurrentLine}}/>

      <TouchableOpacity
        style={[
          styles.absoluteButtons, 
          styles.boardButton,
          !busState.insideBus && styles.boardButtonDisabled,
          busState.scoring && styles.boardButtonScoring,
        ]}
        onPress={handleStartScoring}
        disabled={!busState.insideBus || busState.scoring}
      >
        <Text style={styles.boardButtonText}>
          {busState.scoring 
            ? "Pontuando..."
            : busState.insideBus 
              ? "Entrei no ônibus" 
              : "Fora do ônibus"}
        </Text>
      </TouchableOpacity>

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
  boardButton: {
    top: 40,
    left: 20,
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 180,
    alignItems: "center",
    zIndex: 999,
  },
  boardButtonDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.6,
  },
  boardButtonScoring: {
    backgroundColor: "#FF9800",
  },
  boardButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  }
  
  
  
    
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
