// __mocks__/getLocation.ts
import { Coord } from "../scripts/busDetection";
import { testRoute } from "../test-data/testRoutes";
import { fetchBusPositions } from "../mocks/getBuses";

export const checkPermission = async () => true;

export const watchUserLocation = async (callback: (coords: Coord) => void) => {
  let userPosition: Coord = testRoute[5 * Math.floor(testRoute.length / 7)]; // ponto médio
  let followingBus = false; // flag que indica se o usuário está seguindo o ônibus

  const interval = setInterval(async () => {
    const buses = await fetchBusPositions([]);
    const bus = buses[0];
    if (!bus) return;

    // calcula distância entre usuário e ônibus
    const latDiff = bus.position.latitude - userPosition.latitude;
    const lonDiff = bus.position.longitude - userPosition.longitude;
    const distance = Math.sqrt(latDiff ** 2 + lonDiff ** 2);

    // ativa o estado "seguir ônibus" se estiver perto ou já seguindo
    if (distance < 0.01 || followingBus) {
      followingBus = true; // uma vez ativado, nunca desativa
      userPosition = {
        latitude: bus.position.latitude,
        longitude: bus.position.longitude,
      };
    }

    callback(userPosition);
  }, 1000);

  return {
    remove: () => clearInterval(interval),
  };
};
