<<<<<<< HEAD
import React from "react";
import { Marker } from "react-native-maps";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Bus } from "../scripts/busDetection";

type Props = {
  buses: Bus[];
};

export default function BusesLayer({ buses }: Props) {
  return (
    <>
      {buses.map((bus) => (
        <Marker
          key={bus.id}
          coordinate={{
            latitude: bus.position.latitude,
            longitude: bus.position.longitude,
          }}
          title={`Ônibus ${bus.id}`}
         /*description={`Linha ${bus.route.bus_line}`}*/
        >
          <FontAwesome5 name="bus-alt" size={24} color="white" />
        </Marker>
      ))}
=======
// BusStopsLayer.tsx
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from "react";
import { Marker } from "react-native-maps";

export type Bus = {
  latitude: number;
  longitude: number;
};

export type BusGroup = {
  type: number;
  buses: Bus[];
};

type Props = {
  line: string;
  groups: BusGroup[];
};

export default function BusesLayer({ line, groups }: Props) {
  return (
    <>
      {groups.map((group) =>
        group.buses.map((bus) => (
          <Marker
            key={`${line}: Sentido ${group.type}`}
            coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
          >
            <FontAwesome5
              name="bus-alt"
              size={16}
              color={group.type === 1 ? "#FFBB11" : "#11BBFF"}
            />
          </Marker>
        ))
      )}
>>>>>>> main
    </>
  );
}
