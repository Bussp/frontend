import assert from "node:assert/strict";

import { getUserHistory } from "../src/history";
import { TripCreateRequest } from "../src/models/trips.types";
import { createTrip } from "../src/trips";
import { loginUser, registerUser } from "../src/users";

async function runTests() {
  console.log("== Teste History API ==");

  const email = `history-${Date.now()}@example.com`;
  const password = "123456";

  try {
    // 1) registra usuário
    console.log("Teste 1: registerUser...");
    await registerUser({
      name: "History Tester",
      email,
      password,
    });
    console.log("1/5 registerUser OK!");

    // 2) faz login
    console.log("Teste 2: loginUser...");
    await loginUser(email, password);
    console.log("2/5 loginUser OK!");

    // 3) tenta pegar history SEM histórico
    console.log("Teste 3: getUserHistory (sem histórico)...");
    let failedNoHistory = false;
    try {
      await getUserHistory({ email });
    } catch (err) {
      failedNoHistory = true;
      console.log("3/5 getUserHistory falhou como esperado (usuário sem histórico).");
    }
    assert.ok(
      failedNoHistory,
      "getUserHistory deveria falhar para usuário sem histórico"
    );

    // 4) cria uma trip
    console.log("Teste 4: createTrip (para gerar histórico)...");
    const tripPayload: TripCreateRequest = {
      email,
      route: {
        bus_line: "3090-10",
        bus_direction: 1,
      },
      distance: 5000.0,
      data: new Date().toISOString(),
    };

    const tripResult = await createTrip(tripPayload);
    assert.equal(typeof tripResult.score, "number");
    console.log("4/5 createTrip OK! Score:", tripResult.score);

    // 5) agora pega history COM histórico
    console.log("Teste 5: getUserHistory (com histórico)...");
    const history = await getUserHistory({ email });

    assert.ok(history);
    assert.ok(Array.isArray(history.trips));
    assert.ok(history.trips.length > 0, "history.trips não deveria estar vazio");

    const first = history.trips[0];
    assert.equal(typeof first.date, "string");
    assert.equal(typeof first.score, "number");

    console.log("5/5 getUserHistory OK! Trips:", history.trips.length);
    console.log("\n TODOS TESTES DE HISTORY PASSARAM!\n");
  } catch (err) {
    console.error("\n FALHOU:", err);
    process.exit(1);
  }
}

runTests();
