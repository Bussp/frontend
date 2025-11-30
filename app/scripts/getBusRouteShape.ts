// import { db } from "./db";
import { type RouteShapeResponse } from "@/api/src/models/routes.types";
import { getRouteShape } from "@/api/src/routes";

export type Coord = {
  latitude: number;
  longitude: number;
};

// nao é pra nao funcionar mas nao ta funcionando
export function getShapeForRoute(routeId: string): Promise<RouteShapeResponse> {
  return getRouteShape(routeId);
}
