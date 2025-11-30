// BusStopsLayer.tsx
import React from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type BusStop = {
  latitude: number;
  longitude: number;
};

type Props = {
  stops: BusStop[];
};

export default function BusStopsLayer({ stops }: Props) {
  return (
    <>
      {stops.map((stop, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
        >
          <MaterialCommunityIcons name="bus-stop" size={24} color="#FFBB11" />
        </Marker>
      ))}
    </>
  );
}
