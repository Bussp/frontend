export interface RouteShapeRequest {
    route_id: string;
}

interface Coords {
    latitude: number;
    longitude: number;
}

export interface RouteShapeResponse {
    route_id: string;
    shape_id: string;
    points: Coords[];
}