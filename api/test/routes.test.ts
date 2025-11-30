// api/test/routes.test.ts
import assert from "node:assert/strict";
import { RoutesPositionsRequest } from "../src/models/routes.types";
import { getRouteDetails, getRouteShape, getRoutesPositions } from "../src/routes";
import { loginUser, registerUser } from "../src/users";

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
    console.log("Passo 3: getRouteDetails...");

    const detailsResult = await getRouteDetails({
      routes: [
        {
          bus_line: "8075",
          bus_direction: 1,
        },
      ],
    });

    assert.ok(detailsResult);
    assert.ok(Array.isArray(detailsResult.routes));
    assert.ok(detailsResult.routes.length > 0);

    const resolvedRoutes = detailsResult.routes;
    console.log(`Rotas resolvidas: ${resolvedRoutes.length}`);

    const firstRoute = resolvedRoutes[0];
    assert.equal(typeof firstRoute.route_id, "number");
    assert.ok(firstRoute.route);
    assert.equal(typeof firstRoute.route.bus_line, "string");
    assert.equal(typeof firstRoute.route.bus_direction, "number");

    console.log("getRouteDetails OK");

    // ----------------------
    console.log("Passo 4: getRoutesPositions...");

    const payload: RoutesPositionsRequest = {
      routes: resolvedRoutes, // lista de BusRoute, saída do /routes/details
    };

    const result = await getRoutesPositions(payload);

    assert.ok(result);
    assert.ok(Array.isArray(result.buses));
    console.log(`Buses encontrados: ${result.buses.length}`);

    assert.ok(result.buses.length > 0);
    const first = result.buses[0];

    assert.ok(first.route);
    assert.equal(typeof first.route.bus_line, "string");
    assert.equal(typeof first.route.bus_direction, "number");
    assert.ok(first.position);
    assert.equal(typeof first.position.latitude, "number");
    assert.equal(typeof first.position.longitude, "number");
    assert.equal(typeof first.time_updated, "string");

    console.log("getRoutesPositions OK");

    // ----------------------
    console.log("Passo 5: getRouteShape...");

    // Use um route_id que exista no seu GTFS.
    // Se preferir, troque "1012-10" por outro que você saiba que existe.
    const exampleRouteId = "1012-10";

    const shape = await getRouteShape(exampleRouteId);

    assert.ok(shape);
    assert.equal(typeof shape.route_id, "string");
    assert.equal(shape.route_id, exampleRouteId);

    assert.equal(typeof shape.shape_id, "string");

    assert.ok(Array.isArray(shape.points));
    assert.ok(shape.points.length > 0);

    const firstPoint = shape.points[0];
    assert.equal(typeof firstPoint.latitude, "number");
    assert.equal(typeof firstPoint.longitude, "number");

    console.log("getRouteShape OK");

    console.log("\nTodos os testes de routes passaram.\n");
  } catch (err) {
    console.error("\nFalhou:", err);
    process.exit(1);
  }
}

runTests();
