// api/test/rank.test.ts
import assert from "node:assert/strict";

import type { TripCreateRequest } from "../src/models/trips.types";
import { getGlobalRank, getUserRank } from "../src/ranking";
import { createTrip } from "../src/trips";
import { loginUser, registerUser } from "../src/users";

async function runTests() {
  console.log("== Teste Ranking API ==");

  const email = `rank-${Date.now()}@example.com`;
  const password = "123456";

  try {
    // -------------------------
    console.log("Passo 1: registerUser...");
    const user = await registerUser({
      name: "Rank Test User",
      email,
      password,
    });

    assert.equal(user.email, email);
    console.log("1/5 registerUser OK!");

    // -------------------------
    console.log("Passo 2: loginUser...");
    const login = await loginUser(email, password);

    assert.ok(login.access_token);
    assert.equal(login.token_type, "bearer");
    console.log("2/5 loginUser OK!");

    // 3) cria trip
    console.log("Teste 3: createTrip...");
    const payload: TripCreateRequest = {
      email,
      route: {
        bus_line: "8000-10",
        bus_direction: 1,
      },
      distance: 5000.0,
      data: new Date().toISOString(),
    };
    const tripResult = await createTrip(payload);

    assert.equal(typeof tripResult.score, "number");
    console.log("3/5 createTrip OK! Score:", tripResult.score);

    // Agora o apiClient já tem o token salvo

    // -------------------------
    console.log("Passo 4: getUserRank...");

    const rank = await getUserRank({ email });

    assert.ok(rank);
    assert.equal(typeof rank.position, "number");

    console.log("Posição retornada:", rank.position);
    console.log("4/5 getUserRank OK!");

    // -------------------------
    console.log("Passo 5: getGlobalRank...");

    const global = await getGlobalRank();

    assert.ok(global);
    assert.ok(Array.isArray(global.users));
    assert.ok(global.users.length > 0);

    const first = global.users[0];
    assert.equal(typeof first.name, "string");
    assert.equal(typeof first.email, "string");
    assert.equal(typeof first.score, "number");

    console.log("Total usuários no ranking:", global.users.length);
    console.log("5/5 getGlobalRank OK!");

    console.log("\n TODOS TESTES DE RANK PASSARAM!\n");

  } catch (err) {
    console.error("\n FALHOU:", err);
    process.exit(1);
  }
}

runTests();
