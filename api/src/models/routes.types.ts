
export interface RouteIdentifier {
    bus_line: string;
    bus_direction: number;
  }
  
  export interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  export interface BusPosition {
    route: RouteIdentifier;
    position: Coordinate;
    time_updated: string; // ISO datetime
  }
  
  export interface RoutesPositionsRequest {
    routes: RouteIdentifier[];
  }
  
  export interface RoutesPositionsResponse {
    buses: BusPosition[];
  }
  