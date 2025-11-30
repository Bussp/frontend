// api/test/users.test.ts
import assert from "node:assert/strict";
import { getCurrentUser, getUserByEmail, loginUser, registerUser } from "../src/users";

async function runTests() {
  console.log("== Teste Users API ==");

  const email = `test-${Date.now()}@example.com`;
  const password = "123456";

  try {
    // ----------------------
    console.log("Teste 1: registerUser...");
    const user = await registerUser({
      name: "Test User",
      email,
      password
    });

    assert.equal(user.email, email);
    assert.equal(user.name, "Test User");
    assert.equal(typeof user.score, "number");
    console.log("✅ registerUser OK!");

    // ----------------------
    console.log("Teste 2: loginUser...");
    const login = await loginUser(email, password);

    assert.ok(login.access_token);
    assert.equal(login.token_type, "bearer");
    console.log("token: ",login.access_token);
    console.log("✅ loginUser OK!");

    // ----------------------
    console.log("Teste 3: getCurrentUser...");
    const me = await getCurrentUser();

    assert.equal(me.email, email);
    console.log("✅ getCurrentUser OK!");

    // ----------------------
    console.log("Teste 4: getUserByEmail...");
    const byEmail = await getUserByEmail(email);

    assert.equal(byEmail.email, email);
    console.log("✅ getUserByEmail OK!");

    console.log("\n🎉 TODOS TESTES PASSARAM!\n");
  } catch (err) {
    console.error("\n❌ FALHOU:", err);
    process.exit(1);
  }
}

runTests();
