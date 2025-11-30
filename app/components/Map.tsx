import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { checkPermission, watchUserLocation } from "../scripts/getLocation";
import BottomSheetMenu from "./BottomSheetMenu";
import BusesLayer, { BusGroup } from './BusesLayer';


// maybe considerar os mapas do Expo e nao no React Native?
// fica menos parecido com o Google Maps, talvez?
export default function Map() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isCentered, setIsCentered] = useState(true);
  
  
  const mapRef = useRef<MapView>(null);
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [busesCoords, setBusesCoords] = useState<BusGroup[]>([]);
  

  useEffect(() => {
      if (!currentLine) return;

      const fetchBuses = async () => {
        try {
          console.log(currentLine)
          // const res = await getBuses(currentLine);
          // const groups = convertToBusGroup(res);
          // setBusGroups(groups);
        } catch (error) {
          console.error("Erro ao buscar ônibus: ", error);
        }
      };

      fetchBuses();

      const interval = setInterval(fetchBuses, 5000);

      return () => clearInterval(interval);
  }, [currentLine]);
  
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
            }}
          >
            <View style={styles.userMarker}/>
          </Marker>

          {currentLine!==null && <BusesLayer line={currentLine} groups={busesCoords} />}

      </MapView>

      {!isCentered && (
        <TouchableOpacity style={[styles.absoluteButtons, styles.recenterButton]} onPress={recenter}>
          <AntDesign name="aim" size={20} color="black"/>
        </TouchableOpacity>
      )}


      <TouchableOpacity style={[styles.absoluteButtons, styles.communityButton]}>
          <FontAwesome name="users" size={20} color="black"/>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.absoluteButtons, styles.profileButton]}>
          <FontAwesome name="user" size={20} color="black"/>
      </TouchableOpacity>

      <BottomSheetMenu {...{setCurrentLine}}/>
        
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
    left: 20, 
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
