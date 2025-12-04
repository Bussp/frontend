import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BusPositionsRequest,
  BusPositionsResponse,
  RouteIdentifier,
  RouteShapesRequest,
} from "../models/routes.types";
import {
  getBusPositions,
  getRouteShapes,
  searchRoutes,
} from "../requests/routes";
import { queryKeys } from "./queryClient";

/**
 * Hook for searching bus routes.
 *
 * @param query - Search term (e.g., "809" or "Vila Nova Conceição")
 * @param options - Additional query options
 * @returns Query result with matching routes
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState("");
 * const { data, isLoading } = useSearchRoutes(searchTerm);
 *
 * return (
 *   <View>
 *     <Searchbar
 *       placeholder="Search bus routes"
 *       value={searchTerm}
 *       onChangeText={setSearchTerm}
 *       loading={isLoading}
 *     />
 *     <FlatList
 *       data={data?.routes}
 *       renderItem={({ item }) => <RouteItem route={item} />}
 *     />
 *   </View>
 * );
 * ```
 */
export function useSearchRoutes(
  query: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: queryKeys.routes.search(query),
    queryFn: () => searchRoutes(query),
    enabled: query.length > 0 && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 60 * 1000, // Results are fresh for 1 minute
  });
}

/**
 * Hook for fetching real-time bus positions.
 *
 * @param routeIds - Array of route IDs to get positions for
 * @param options - Additional query options
 * @returns Query result with bus positions
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useBusPositions([123, 456], {
 *   refetchInterval: 10000, // Refresh every 10 seconds
 * });
 *
 * return (
 *   <MapView>
 *     {data?.buses.map((bus) => (
 *       <Marker
 *         key={`${bus.route_id}-${bus.time_updated}`}
 *         coordinate={bus.position}
 *       />
 *     ))}
 *   </MapView>
 * );
 * ```
 */
export function useBusPositions(
  routeIds: number[],
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
  }
) {
  const request: BusPositionsRequest = {
    routes: routeIds.map((route_id) => ({ route_id })),
  };

  return useQuery({
    queryKey: queryKeys.routes.positions(routeIds),
    queryFn: () => getBusPositions(request),
    enabled: routeIds.length > 0 && (options?.enabled ?? true),
    staleTime: 5 * 1000, // Positions are fresh for 5 seconds (real-time data)
    refetchInterval: options?.refetchInterval ?? false,
  });
}

/**
 * Hook for fetching bus positions as a mutation (for manual control).
 * Use this when you to control exactly when we fetch positions.
 *
 * @returns Mutation for fetching bus positions
 *
 * @example
 * ```tsx
 * const { mutate: fetchPositions, data, isPending } = useFetchBusPositions();
 *
 * const handleRefresh = () => {
 *   fetchPositions({ routes: [{ route_id: 123 }] });
 * };
 * ```
 */
export function useFetchBusPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BusPositionsRequest) => getBusPositions(request),
    onSuccess: (data: BusPositionsResponse, variables: BusPositionsRequest) => {
      // Update the cache with the new positions
      const routeIds = variables.routes.map((r) => r.route_id);
      queryClient.setQueryData(queryKeys.routes.positions(routeIds), data);
    },
  });
}

/**
 * Hook for fetching route shapes (geographic coordinates).
 *
 * @param routes - Array of route identifiers to get shapes for
 * @param options - Additional query options
 * @returns Query result with route shapes
 *
 * @example
 * ```tsx
 * const routes = [{ bus_line: "809", bus_direction: 1 }];
 * const { data, isLoading } = useRouteShapes(routes);
 *
 * return (
 *   <MapView>
 *     {data?.shapes.map((shape) => (
 *       <Polyline
 *         key={shape.shape_id}
 *         coordinates={shape.points}
 *       />
 *     ))}
 *   </MapView>
 * );
 * ```
 */
export function useRouteShapes(
  routes: RouteIdentifier[],
  options?: { enabled?: boolean }
) {
  const request: RouteShapesRequest = { routes };

  return useQuery({
    queryKey: queryKeys.routes.shapes(routes),
    queryFn: () => getRouteShapes(request),
    enabled: routes.length > 0 && (options?.enabled ?? true),
    staleTime: 24 * 60 * 60 * 1000, // Shapes are static, cache for 24 hours
  });
}
