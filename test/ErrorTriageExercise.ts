import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("ErrorTriageExercise", async function () {
  const { viem } = await network.connect();

  it("diffWithNeighbor returns absolute diffs", async function () {
    const c = await viem.deployContract("ErrorTriageExercise");
    const res = (await c.read.diffWithNeighbor([1n, 5n, 2n, 10n])) as bigint[];
    assert.deepEqual(res.map(Number), [4, 3, 8]);
  });

  it("applyModifier applies positive and negative correctly", async function () {
    const c = await viem.deployContract("ErrorTriageExercise");
    const pos = (await c.read.applyModifier([1000n, 25n])) as bigint;
    const neg = (await c.read.applyModifier([1000n, -25n])) as bigint;
    assert.equal(Number(pos), 1025);
    assert.equal(Number(neg), 975);

  it("popWithReturn pops last or returns 0 on empty", async function () {
    const c = await viem.deployContract("ErrorTriageExercise");

    await c.write.addToArr([10n]);
    await c.write.addToArr([20n]);

    // Simulate the pop to get its return value, then execute the transaction.
    const { result: v1 } = await c.simulate.popWithReturn();
    await c.write.popWithReturn();
    assert.equal(Number(v1), 20);

    const { result: v2 } = await c.simulate.popWithReturn();
    await c.write.popWithReturn();
    assert.equal(Number(v2), 10);

    const { result: v3 } = await c.simulate.popWithReturn();
    await c.write.popWithReturn();
    assert.equal(Number(v3), 0);
  });
  });
});
