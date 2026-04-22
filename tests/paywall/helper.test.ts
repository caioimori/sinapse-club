/**
 * PAYWALL-4 AC-3/AC-4: Helper requirePaidTier + action guard.
 *
 * Testa a logica de PaywallError e role_rank comparisons.
 * Executar: `node --test --import tsx tests/paywall/helper.test.ts`
 */
import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { roleRank } from "../../src/lib/access";
import { PAYWALL_ERROR_CODES, PaywallError } from "../../src/lib/access/paywall";

describe("PAYWALL-3 helper logic", () => {
  test("role_rank returns 0 for unknown role", () => {
    assert.equal(roleRank("anon"), 0);
  });

  test("role_rank: free=10, pro=20, premium=30, instructor=90, admin=100", () => {
    assert.equal(roleRank("free"), 10);
    assert.equal(roleRank("pro"), 20);
    assert.equal(roleRank("premium"), 30);
    assert.equal(roleRank("instructor"), 90);
    assert.equal(roleRank("admin"), 100);
  });

  test("paid gate threshold = 20: free blocked, pro+ pass", () => {
    const threshold = 20;
    assert.ok(roleRank("free") < threshold);
    assert.ok(roleRank("pro") >= threshold);
    assert.ok(roleRank("premium") >= threshold);
    assert.ok(roleRank("instructor") >= threshold);
    assert.ok(roleRank("admin") >= threshold);
  });

  test("PaywallError preserva code", () => {
    const err = new PaywallError(PAYWALL_ERROR_CODES.PAYWALL_BLOCKED, "Upgrade");
    assert.equal(err.code, "PAYWALL_BLOCKED");
    assert.equal(err.message, "Upgrade");
    assert.ok(err instanceof Error);
  });

  test("error codes const shape", () => {
    assert.equal(PAYWALL_ERROR_CODES.UNAUTHENTICATED, "UNAUTHENTICATED");
    assert.equal(PAYWALL_ERROR_CODES.PAYWALL_BLOCKED, "PAYWALL_BLOCKED");
  });
});
