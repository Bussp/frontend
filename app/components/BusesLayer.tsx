
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from "react";
import { Marker } from "react-native-maps";
import { Bus } from "../../models/buses";

type Props = {
  line: string;
  buses: Bus[];
};

export default function BusesLayer({ line, buses }: Props) {
  return (
    <>
      {buses.map((bus) =>
        <Marker
          key={`${line} (${bus.id}): Sentido ${bus.type}`}
          coordinate={{ latitude: bus.position.latitude, longitude: bus.position.longitude }}
          anchor={{ x: .2, y: .2 }}
        >
          <FontAwesome5
            name="bus-alt"
            size={16}
            color={(bus.type === 1) ? "#11BBFF" : "#11DD33"}
          />
        </Marker>
      )}
    </>
  );
}
