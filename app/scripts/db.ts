import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import Papa from "papaparse";

export const db = SQLite.openDatabaseSync("gtfs.db");

export async function initDB() {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        route_id TEXT,
        service_id TEXT,
        trip_id TEXT,
        trip_headsign TEXT,
        direction_id TEXT,
        shape_id TEXT
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shapes (
        shape_id TEXT,
        shape_pt_lat REAL,
        shape_pt_lon REAL,
        shape_pt_sequence INTEGER,
        shape_dist_traveled REAL
    `);
  });
}

async function readCSV(path: string) {
  const text = await FileSystem.readAsStringAsync(path);
  const result = Papa.parse(text, { header: true, skipEmptyLines: true });
  return result.data as any[];
}

export async function populateDB() {
  const tripsCSV = await readCSV(FileSystem.documentDirectory + "trips.csv");
  const shapesCSV = await readCSV(FileSystem.documentDirectory + "shapes.csv");

  await db.withTransactionAsync(async () => {
    tripsCSV.forEach(async (row) => {
      await db.runAsync(
        `INSERT INTO trips (route_id, service_id, trip_id, trip_headsign, direction_id, shape_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          row.route_id,
          row.service_id,
          row.trip_id,
          row.trip_headsign,
          row.direction_id,
          row.shape_id,
        ]
      );
    });

    shapesCSV.forEach(async (row) => {
      await db.runAsync(
        `INSERT INTO shapes (shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled)
         VALUES (?, ?, ?, ?, ?)`,
        [
          row.shape_id,
          Number(row.shape_pt_lat),
          Number(row.shape_pt_lon),
          Number(row.shape_pt_sequence),
          Number(row.shape_dist_traveled),
        ]
      );
    });
  });
}
