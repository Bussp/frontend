// api/test/routes.test.ts
import assert from "node:assert/strict";
import { RoutesPositionsRequest } from "../src/models/routes.types";
import { getRoutesPositions } from "../src/routes";
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
    console.log("✅ registerUser OK!");

    // ----------------------
    console.log("Passo 2: loginUser...");
    const login = await loginUser(email, password);

    assert.ok(login.access_token);
    assert.equal(login.token_type, "bearer");
    console.log("✅ loginUser OK!");

    // A partir daqui o apiClient já está com o token setado

    // ----------------------
    console.log("Passo 3: getRoutesPositions...");

    const payload: RoutesPositionsRequest = {
      routes: [
        {
          bus_line: "8084-10", 
          bus_direction: 1,
        },
      ],
    };

    const result = await getRoutesPositions(payload);

    assert.ok(result);
    assert.ok(Array.isArray(result.buses));
    console.log(`Buses encontrados: ${result.buses.length}`);

    console.log(result.buses[0].position);

    const first = result.buses[0];

    assert.ok(first.route);
    assert.equal(typeof first.route.bus_line, "string");
    assert.equal(typeof first.route.bus_direction, "number");
    assert.ok(first.position);
    assert.equal(typeof first.position.latitude, "number");
    assert.equal(typeof first.position.longitude, "number");
    assert.equal(typeof first.time_updated, "string");
    

    console.log("✅ getRoutesPositions OK!");
    console.log("\n🎉 TODOS TESTES DE ROUTES PASSARAM!\n");
  } catch (err) {
    console.error("\n❌ FALHOU:", err);
    process.exit(1);
  }
}

runTests();
