import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("BasicMath", async function () {
  const { viem } = await network.connect();

  it("adds without overflow and returns error=false", async function () {
    const basic = await viem.deployContract("BasicMath");

    const [sum, error] = await basic.read.add([1n, 2n]);
    assert.equal(sum, 3n);
    assert.equal(error, false);
  });

  it("detects overflow and returns error=true with zeroed result", async function () {
    const basic = await viem.deployContract("BasicMath");
    const max = (await basic.read.MAX_UINT256()) as bigint;

    const [sum, error] = await basic.read.add([max, 1n]);
    assert.equal(sum, 0n);
    assert.equal(error, true);
  });

  it("subtracts without underflow and returns error=false", async function () {
    const basic = await viem.deployContract("BasicMath");

    const [diff, error] = await basic.read.sub([5n, 4n]);
    assert.equal(diff, 1n);
    assert.equal(error, false);
  });

  it("detects underflow and returns error=true with zeroed result", async function () {
    const basic = await viem.deployContract("BasicMath");

    const [diff, error] = await basic.read.sub([0n, 1n]);
    assert.equal(diff, 0n);
    assert.equal(error, true);
  });
});


