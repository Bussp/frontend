// Entrada do /routes/details
export type RouteIdentifier = {
  bus_line: string;
  bus_direction: number;
};

// Saída do /routes/details e ENTRADA do /routes/positions
export type BusRoute = {
  route_id: number;
  route: RouteIdentifier;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type BusPosition = {
  route: RouteIdentifier; // backend devolve apenas o identificador simples
  position: Coordinate;
  time_updated: string; // ISO datetime
};

/**
 * /routes/details
 */
export type RoutesDetailsRequest = {
  routes: RouteIdentifier[];
};

export type RoutesDetailsResponse = {
  routes: BusRoute[];
};

/**
 * /routes/positions
 */
export type RoutesPositionsRequest = {
  routes: BusRoute[];
};

export type RoutesPositionsResponse = {
  buses: BusPosition[];
};

export interface RouteShapeResponse {
  route_id: string;
  shape_id: string;
  points: Coordinate[];
}
