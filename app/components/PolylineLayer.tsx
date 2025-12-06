import React from "react";
import { Polyline } from "react-native-maps";

type Coord = {
  latitude: number;
  longitude: number;
};

type PolylineLayerProps = {
  points: Coord[];
  lineColor?: string;
  lineWidth?: number;
};

export default function PolylineLayer({
  points,
  lineColor = '#FFBB11',
  lineWidth = 3,
}: PolylineLayerProps) {
  if (!points || points.length < 2) return null; // precisa de pelo menos 2 pontos senao vai pro krl

  return (
    <>
      <Polyline coordinates={points} strokeColor={lineColor} strokeWidth={lineWidth} />
    </>
  );
}
