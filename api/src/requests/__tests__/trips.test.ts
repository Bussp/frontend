// api/src/requests/__tests__/trips.test.ts
import assert from "node:assert/strict";
import type { CreateTripRequest } from "../../models/trips.types";
import { createTrip } from "../trips";
import { loginUser, registerUser } from "../users";

async function runTests() {
  console.log("== Teste Trips API ==");

  let email = `triptest-${Date.now()}@example.com`;
  let password = "123456";

  try {
    // 1) registra usuário
    console.log("Teste 1: registerUser...");
    await registerUser({
      name: "Trip Tester",
      email,
      password,
    });
    console.log("1/3 registerUser OK!");

    // 2) faz login (para setar o JWT no client)
    console.log("Teste 2: loginUser...");
    await loginUser(email, password);
    console.log("2/3 loginUser OK!");

    // 3) cria trip
    console.log("Teste 3: createTrip...");
    const payload: CreateTripRequest = {
      route: {
        bus_line: "8000-10",
        bus_direction: 1,
      },
      distance: 5000.0,
      trip_datetime: new Date().toISOString(),
    };
    const tripResult = await createTrip(payload);

    assert.equal(typeof tripResult.score, "number");
    console.log("3/3 createTrip OK! Score:", tripResult.score);

    console.log("\n TODOS TESTES DE TRIPS PASSARAM!\n");
  } catch (err) {
    console.error("\n FALHOU:", err);
    process.exit(1);
  }
}

runTests();
