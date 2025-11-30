import haversine from "haversine-distance";

export interface Coord {
  latitude: number;
  longitude: number;
}

export interface BusState {
  insideBus: boolean;
  busId: string | null;
  lastBusPosition: Coord | null;
  lastUserPosition: Coord | null;
  lastTime: number | null;

  distHistory: number[];
  distIndex: number;
  closeCount: number;
}

export interface Bus { id: string; position: Coord; }

const DIST_USER_TO_BUS = 250; // é q se o gps for mto ruidoso, pode ser q o user esteja marcado mto longe do ponto de onibus apesar de nao estar

function dist(a: Coord, b: Coord) {
  //return haversine(a, b);
  const meterPerDeg = 111320;

  const dx = (a.longitude - b.longitude)*meterPerDeg;
  const dy = (a.latitude - b.latitude)*meterPerDeg;
  return Math.sqrt(dx*dx + dy*dy);
}

/*
 Ele guarda um array das N ultimas distancias user<->bus mais proximo
 Se o usuario estiver proximo a DIST_USER_TO_BUS por 40% das vezes, ele considera que o cara tá no bus
 Dai tem umas quirks do codigo, tipo: o array é circular pra evitar dar shift toda hora (é custoso fazer isso -> to usando idx pra isso)
 E tb tem um contador de quantas vezes a distancia é pequena o bastante
*/
export function detectBusState(state: BusState, user: Coord, buses: Bus[], route: Coord[]): BusState {
  const now = Date.now();

  let nearestBus: Bus | null = null;
  let nearestDist = Infinity;

  for (const b of buses) {
    const d = dist(user, b.position);
    if (d < nearestDist) {
      nearestBus = b;
      nearestDist = d;
    }
  }

  const busNow = nearestBus?.position ?? state.lastBusPosition;

  const N = state.distHistory.length;
  const idx = state.distIndex;
  const oldDist = state.distHistory[idx];
  const newDist = nearestDist;

  let newCloseCount = state.closeCount;

  const wasClose = oldDist < DIST_USER_TO_BUS;
  const isClose  = newDist < DIST_USER_TO_BUS;

  if (wasClose && !isClose) newCloseCount--;
  if (!wasClose && isClose) newCloseCount++;

  const newHistory = [...state.distHistory];
  newHistory[idx] = newDist;

  const nextIndex = (idx+1)%N;

  const inside = (newCloseCount >= 0.4*N);
  return {
    insideBus: inside,
    busId: inside ? (nearestBus?.id ?? state.busId) : null,
    lastBusPosition: busNow,
    lastUserPosition: user,
    lastTime: now,

    distHistory: newHistory,
    distIndex: nextIndex,
    closeCount: newCloseCount,
  };
}
