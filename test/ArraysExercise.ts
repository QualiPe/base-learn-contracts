import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("ArraysExercise", async function () {
  const { viem } = await network.connect();

  const initialNumbers = [
    1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n,
  ];

  it("getNumbers returns initial numbers", async function () {
    const c = await viem.deployContract("ArraysExercise");
    const nums = (await c.read.getNumbers()) as bigint[];
    assert.deepEqual(nums, initialNumbers);
  });

  it("appendToNumbers appends values", async function () {
    const c = await viem.deployContract("ArraysExercise");
    await c.write.appendToNumbers([[11n, 12n]]);
    const nums = (await c.read.getNumbers()) as bigint[];
    assert.deepEqual(nums, [...initialNumbers, 11n, 12n]);
  });

  it("resetNumbers resets to initial set", async function () {
    const c = await viem.deployContract("ArraysExercise");
    await c.write.appendToNumbers([[11n, 12n]]);
    await c.write.resetNumbers();
    const nums = (await c.read.getNumbers()) as bigint[];
    assert.deepEqual(nums, initialNumbers);
  });

  it("saveTimestamp + afterY2K filters correctly", async function () {
    const c = await viem.deployContract("ArraysExercise");

    const [deployer] = await viem.getWalletClients();
    const deployerAddress = deployer.account.address;

    // 946702800 is Y2K; only strictly greater should pass
    await c.write.saveTimestamp([946702799n]);
    await c.write.saveTimestamp([946702800n]);
    await c.write.saveTimestamp([946702801n]);

    const [tsAfter, sendersAfter] = (await c.read.afterY2K()) as [
      bigint[],
      string[],
    ];

    assert.equal(tsAfter.length, 1);
    assert.equal(sendersAfter.length, 1);
    assert.equal(tsAfter[0], 946702801n);
    assert.equal(sendersAfter[0], deployerAddress);
  });

  it("resetSenders + resetTimestamps clears data", async function () {
    const c = await viem.deployContract("ArraysExercise");

    await c.write.saveTimestamp([946702900n]);
    await c.write.saveTimestamp([946703000n]);

    // Clear both arrays to keep indices aligned
    await c.write.resetSenders();
    await c.write.resetTimestamps();

    const [tsAfter, sendersAfter] = (await c.read.afterY2K()) as [
      bigint[],
      string[],
    ];

    assert.equal(tsAfter.length, 0);
    assert.equal(sendersAfter.length, 0);
  });
});


