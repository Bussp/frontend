// __mocks__/getBuses.ts
import { Bus } from "../scripts/busDetection";
import { testRoute } from "../test-data/testRoutes";

let step = 0;

export const fetchBusPositions = async (): Promise<Bus[]> => {
  const bus: Bus = {
    id: "bus1",
    position: testRoute[step],
  };

  step = (step+10) % testRoute.length;

  return [bus];
};
