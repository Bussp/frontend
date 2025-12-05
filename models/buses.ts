export interface Coord {
  latitude: number;
  longitude: number;
}

export interface Bus {
  id: string;
  type: number;
  position: Coord;
};

export interface BusState {
  currentLine: string | null;
  insideBus: boolean;
  scoring: boolean;
  entryPosition:Coord | null;

  busId: string | null;
  lastBusPosition: Coord | null;
  lastUserPosition: Coord | null;
  lastTime: number | null;
  distHistory: number[];
  distIndex: number;
  closeCount: number;
}

export interface busLine {
  cl: number;
  lc: boolean;
  lt: string;
  sl: number;
  tl: number;
  tp: string;
  ts: string;
}