import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("ErrorTriageExercise", async function () {
  const { viem } = await network.connect();

  it("diffWithNeighbor returns absolute diffs", async function () {
    const c = await viem.deployContract("ErrorTriageExercise");
    const res = (await c.read.diffWithNeighbor([1, 5, 2, 10])) as bigint[];
    assert.deepEqual(res.map(Number), [4, 3, 8]);
  });

  it("applyModifier applies positive and negative correctly", async function () {
    const c = await viem.deployContract("ErrorTriageExercise");
    const pos = (await c.read.applyModifier([1000, 25])) as bigint;
    const neg = (await c.read.applyModifier([1000, -25])) as bigint;
    assert.equal(Number(pos), 1025);
    assert.equal(Number(neg), 975);
  });

  it("popWithReturn pops last or returns 0 on empty", async function () {
    const c = await viem.deployContract("ErrorTriageExercise");

    await c.write.addToArr([10]);
    await c.write.addToArr([20]);

    const first = (await c.write.popWithReturn()) as unknown; // write returns hash; use read via call
    const v1 = (await c.read.popWithReturn()) as bigint;
    assert.equal(Number(v1), 20);

    const v2 = (await c.read.popWithReturn()) as bigint;
    assert.equal(Number(v2), 10);

    const v3 = (await c.read.popWithReturn()) as bigint;
    assert.equal(Number(v3), 0);
  });
});


