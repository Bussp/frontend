export interface Coord {
  latitude: number;
  longitude: number;
}

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
    currentLine: state.currentLine,
    insideBus: inside,
    scoring: state.scoring,
    entryPosition: state.entryPosition,

    busId: inside ? (nearestBus?.id ?? state.busId) : null,
    lastBusPosition: busNow,
    lastUserPosition: user,
    lastTime: now,

    distHistory: newHistory,
    distIndex: nextIndex,
    closeCount: newCloseCount,
  };
}


export function startScoring(state: BusState, shape: Coord[], user: Coord): BusState {
  if (!user || shape.length === 0) {
    return state;
  }

  // Encontra o ponto do shape mais próximo do usuário
  let nearestPoint = shape[0];
  let minDist = dist(user, nearestPoint);

  for (let i = 1; i < shape.length; i++) {
    const point = shape[i];
    const d = dist(user, point);
    if (d < minDist) {
      minDist = d;
      nearestPoint = point;
    }
  }

  return {
    ...state,
    scoring: true,
    entryPosition: nearestPoint,  // nome novo
  };
}


export function computeScore(
  state: BusState,
  shape: Coord[],
  user: Coord
): number {
  // Sem shape ou sem entryPosition não tem como calcular
  if (!state.entryPosition || shape.length < 2) {
    return 0;
  }

  // Helper: encontra o índice do ponto mais próximo de um alvo no shape
  const findNearestIndex = (target: Coord, points: Coord[]): number => {
    let nearestIndex = 0;
    let minDist = dist(target, points[0]);

    for (let i = 1; i < points.length; i++) {
      const d = dist(target, points[i]);
      if (d < minDist) {
        minDist = d;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  };

  // Índice do ponto de entrada (onde começou a contagem)
  const entryIndex = findNearestIndex(state.entryPosition, shape);
  // Índice do ponto de saída (ponto mais próximo do usuário ao sair)
  const exitIndex = findNearestIndex(user, shape);

  // Se, por algum motivo, forem o mesmo ponto, distância ~ 0
  if (entryIndex === exitIndex) {
    return 0;
  }

  // Queremos percorrer o shape entre esses dois índices
  const start = Math.min(entryIndex, exitIndex);
  const end = Math.max(entryIndex, exitIndex);

  let totalDistance = 0;

  for (let i = start; i < end; i++) {
    totalDistance += dist(shape[i], shape[i + 1]);
  }

  // totalDistance está em metros (porque dist usa meterPerDeg)
  return totalDistance;
}

export function stopScoring(state: BusState): BusState {
  return {
    ...state,
    scoring: false,
    entryPosition: null,
  };
}