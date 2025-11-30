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
}

export interface Bus { id: string; position: Coord; }

const DIST_USER_TO_ROUTE = 10; // é q se o gps for mto ruidoso, pode ser q o user esteja marcado mto longe do ponto de onibus apesar de nao estar
const BUS_PASS_RADIUS = 25;
const EXIT_DISTANCE = 45; // se o user tava dentro do bus mas saiu
const MIN_SPEED = 1.5; // em m/s (uns 5km/h +- o cara nao deve ser o bolt né)

function dist(a: Coord, b: Coord) {
  return haversine(a, b);
}

function findClosestPointIndex(point: Coord, route: Coord[]): number {
  let bestIndex = 0;
  let bestDist = Infinity;

  for (let i = 0; i < route.length; i++) {
    const d = dist(point, route[i]);
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
    if (d == 0) { // vai que o bus ta literalmente no ponto da rota
      return bestIndex;
    }
  }
  return bestIndex;
}

function userIsBetweenOnRoute(busPrev: Coord, busNow: Coord, user: Coord, route: Coord[]) {
  const idxPrev = findClosestPointIndex(busPrev, route);
  const idxNow  = findClosestPointIndex(busNow, route);
  const idxUser = findClosestPointIndex(user, route);

  const i1 = Math.min(idxPrev, idxNow);
  const i2 = Math.max(idxPrev, idxNow);

  return ((i1 <= idxUser) && (idxUser <= i2)) || ((i1 >= idxUser) && (idxUser >= i2));
  // é um OU pq os indices podem ser lidos de tras pra frente ou frente pra tras
  // a depender do sentido da rota (ex: Butantã -> P3 vs P3 -> Butantã)
}

/*
Acho q calha uma explicação. Basicamente pra gente detectar que um usuário entrou no bus depende de algumas coisas:

0. o usuario nao pode estar no estado "dentro de um onibus"
1. o usuario tem q estar perto o suficiente da rota (nao adianta o amigao estar a 2 quadras da rota do bus)
2. o onibus tem que passar perto do usuario
    2.1. a gente pode verificar isso se o onibus passar a certo raio do usuario
    2.2. mas tb, por causa do delay da atualizacao da propria API da SPTrans, pode ser que o onibus passe
         na frente do usuario via um "teletransporte". Tipo, finge que tem esses 3 pontos de onibus: A, B, C,
         nessa ordem. Finge q o user tá no ponto B e o onibus inicialmente tá no ponto A. Finge que, por sei lá
         que motivos, demorou pra krl pra API atualizar a posicao desse onibus e no proximo instante a posicao do
         onibus é no ponto C. então a gente pode deduzir que o onibus certamente passou em algum momento pelo ponto B
         mesmo que n tenhamos visto.
3. o usuario começou a se mover

Se essas 4 coisas foram cumpridas, a gente pode assumir que o user entrou no onibus

Pra detectar que o user saiu do onibus:

0. o usuario tem que estar no estado "dentro de um onibus"
1. a distancia entre um onibus e um usuario foi maior que delta por tantos instantes
*/

export function detectBusState(state: BusState, user: Coord, buses: Bus[], route: Coord[]): BusState {

  const now = Date.now();
  const dt = state.lastTime ? (now-state.lastTime)/1000 : 1;

  let userSpeed = 0;
  if (state.lastUserPosition) {
    userSpeed = dist(user, state.lastUserPosition)/dt;
  }

  const userIdx = findClosestPointIndex(user, route);
  const userDist = dist(user, route[userIdx]);
  const userNearRoute = (userDist <= DIST_USER_TO_ROUTE);

  let nearestBus: Bus | null = null;
  let nearestDist = Infinity;

  for (const b of buses) {
    const d = dist(user, b.position);
    if (d < nearestDist) {
      nearestBus = b;
      nearestDist = d;
    }
  }
  const busNow = nearestBus?.position ?? null;

  // pra detectar a passagem real do ônibus
  const busPassedNear = (nearestDist <= BUS_PASS_RADIUS);

  // pra detectar "teletransporte"
  let busPassedViaTeleport = false;
  if (!busPassedNear && state.lastBusPosition && busNow) {
    const jump = dist(busNow, state.lastBusPosition);
    if (userIsBetweenOnRoute(state.lastBusPosition, busNow, user, route)) {
      busPassedViaTeleport = true;
    }
  }

  const busPassed = busPassedNear || busPassedViaTeleport;
  const userMoving = (userSpeed >= MIN_SPEED);

  console.log("passou perto?", busPassed, busPassedNear, busPassedViaTeleport);

  // aqui ó q detecta se o cara entrou no bus de fato
  if (userNearRoute && busPassed && userMoving) {
    return {
      insideBus: true,
      busId: nearestBus?.id ?? null,
      lastBusPosition: busNow,
      lastUserPosition: user,
      lastTime: now,
    };
  }

  // aqui ó q detecta se o cara saiu do bus
  if (busNow) {
    const d = dist(user, busNow);
    console.log("d grande! user:", user, "busNow:", busNow, "d:", d);
    if (d > EXIT_DISTANCE) {

      return {
        insideBus: false,
        busId: null,
        lastBusPosition: busNow,
        lastUserPosition: user,
        lastTime: now,
      };
    }

    return {
      insideBus: true,
      busId: state.busId,
      lastBusPosition: busNow,
      lastUserPosition: user,
      lastTime: now,
    };
  }
}