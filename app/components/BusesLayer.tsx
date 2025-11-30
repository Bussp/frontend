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
    </>
  );
}
