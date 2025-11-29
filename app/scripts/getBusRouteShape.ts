import { db } from "./db";

export type Coord = {
  latitude: number;
  longitude: number;
};

// nao é pra nao funcionar mas nao ta funcionando
export function getShapeForRoute(routeId: string): Promise<Coord[]> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT shape_id FROM trips WHERE route_id = ? LIMIT 1`,
        [routeId],
        (_, { rows }) => {
          if (rows.length === 0) {
            resolve([]);
            return;
          }

          const shapeId = rows.item(0).shape_id;

          tx.executeSql(
            `SELECT shape_pt_lat, shape_pt_lon
             FROM shapes
             WHERE shape_id = ?
             ORDER BY shape_pt_sequence ASC`,
            [shapeId],
            (_, { rows }) => {
              const coords: Coord[] = [];
              for (let i = 0; i < rows.length; i++) {
                const r = rows.item(i);
                coords.push({
                  latitude: r.shape_pt_lat,
                  longitude: r.shape_pt_lon,
                });
              }
              resolve(coords);
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
