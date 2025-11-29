// BusStopsLayer.tsx
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from "react";
import { Marker } from "react-native-maps";

type Buses = {
  latitude: number;
  longitude: number;
};

type Props = {
    line: string;
    type: number;
    stops: Buses[];
};

export default function BusesLayer({ line, type, stops }: Props) {
  return (
    <>
      {stops.map((bus) => (
        <Marker
          key={line}
          coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
        >
          <FontAwesome5 name="bus-alt" size={16} color={(type===1) ? '#FFBB11' : '#11BBFF'} />
        </Marker>
      ))}
    </>
  );
}