// BusStopsLayer.tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from "react";
import { Marker } from "react-native-maps";
import { Coord } from '../models/buses';

type Props = {
  stops: Coord[];
};

export default function BusStopsLayer({ stops }: Props) {
  return (
    <>
      {stops.map((stop, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
          anchor={{ x: 0.5, y: 0 }}
        >
          <MaterialCommunityIcons name="bus-stop" size={24} color="#FFBB11" />
        </Marker>
      ))}
    </>
  );
}
