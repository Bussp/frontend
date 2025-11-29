// api/models/trips.types.ts

export interface TripRouteInfo {
    bus_line: string;
    bus_direction: number;
  }
  
  export interface TripCreateRequest {
    email: string;
    route: TripRouteInfo;
    distance: number;
    data: string; // ISO date string, ex: new Date().toISOString()
  }
  
  export interface TripCreateResponse {
    score: number;
  }
  