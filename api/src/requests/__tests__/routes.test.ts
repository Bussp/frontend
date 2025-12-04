// api/src/requests/__tests__/routes.test.ts
import assert from "node:assert/strict";
import type {
  BusPositionsRequest,
  RouteShapesRequest,
} from "../../models/routes.types";
import { getBusPositions, getRouteShapes, searchRoutes } from "../routes";
import { loginUser, registerUser } from "../users";

async function runTests() {
  console.log("== Teste Routes API ==");

  const email = `routes-test-${Date.now()}@example.com`;
  const password = "123456";

  try {
    // ----------------------
    console.log("Passo 1: registerUser...");
    const user = await registerUser({
      name: "Routes Test User",
      email,
      password,
    });

    assert.equal(user.email, email);
    console.log("registerUser OK");

    // ----------------------
    console.log("Passo 2: loginUser...");
    const login = await loginUser(email, password);

    assert.ok(login.access_token);
    assert.equal(login.token_type, "bearer");
    console.log("loginUser OK");

    // A partir daqui o apiClient já está com o token setado

    // ----------------------
    console.log("Passo 3: searchRoutes...");

    const searchResult = await searchRoutes("8075");

    assert.ok(searchResult);
    assert.ok(Array.isArray(searchResult.routes));
    assert.ok(searchResult.routes.length > 0);

    const routes = searchResult.routes;
    console.log(`Rotas encontradas: ${routes.length}`);

    const firstRoute = routes[0];
    assert.equal(typeof firstRoute.route_id, "number");
    assert.ok(firstRoute.route);
    assert.equal(typeof firstRoute.route.bus_line, "string");
    assert.equal(typeof firstRoute.route.bus_direction, "number");

    console.log("searchRoutes OK");

    // ----------------------
    console.log("Passo 4: getBusPositions...");

    const positionsPayload: BusPositionsRequest = {
      routes: routes.map((r) => ({ route_id: r.route_id })),
    };

    const positionsResult = await getBusPositions(positionsPayload);

    assert.ok(positionsResult);
    assert.ok(Array.isArray(positionsResult.buses));
    console.log(`Buses encontrados: ${positionsResult.buses.length}`);

    if (positionsResult.buses.length > 0) {
      const first = positionsResult.buses[0];

      assert.equal(typeof first.route_id, "number");
      assert.ok(first.position);
      assert.equal(typeof first.position.latitude, "number");
      assert.equal(typeof first.position.longitude, "number");
      assert.equal(typeof first.time_updated, "string");
    }

    console.log("getBusPositions OK");

    // ----------------------
    console.log("Passo 5: getRouteShapes...");

    const shapesPayload: RouteShapesRequest = {
      routes: [
        {
          bus_line: "8075-10",
          bus_direction: 1,
        },
      ],
    };

    const shapesResult = await getRouteShapes(shapesPayload);

    assert.ok(shapesResult);
    assert.ok(Array.isArray(shapesResult.shapes));
    assert.ok(shapesResult.shapes.length > 0);

    const firstShape = shapesResult.shapes[0];
    assert.ok(firstShape.route);
    assert.equal(typeof firstShape.route.bus_line, "string");
    assert.equal(typeof firstShape.route.bus_direction, "number");
    assert.equal(typeof firstShape.shape_id, "string");

    assert.ok(Array.isArray(firstShape.points));
    assert.ok(firstShape.points.length > 0);

    const firstPoint = firstShape.points[0];
    assert.equal(typeof firstPoint.latitude, "number");
    assert.equal(typeof firstPoint.longitude, "number");

    console.log("getRouteShapes OK");

    console.log("\nTodos os testes de routes passaram.\n");
  } catch (err) {
    console.error("\nFalhou:", err);
    process.exit(1);
  }
}

runTests();
