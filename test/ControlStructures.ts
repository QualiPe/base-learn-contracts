import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("ControlStructures", async function () {
  const { viem } = await network.connect();

  it("fizzBuzz returns expected values", async function () {
    const c = await viem.deployContract("ControlStructures");

    assert.equal(await c.read.fizzBuzz([1n]), "Splat");
    assert.equal(await c.read.fizzBuzz([3n]), "Fizz");
    assert.equal(await c.read.fizzBuzz([5n]), "Buzz");
    assert.equal(await c.read.fizzBuzz([15n]), "FizzBuzz");
  });

  it("doNotDisturb returns Morning/Afternoon/Evening as expected", async function () {
    const c = await viem.deployContract("ControlStructures");

    assert.equal(await c.read.doNotDisturb([800n]), "Morning!");
    assert.equal(await c.read.doNotDisturb([1199n]), "Morning!");
    assert.equal(await c.read.doNotDisturb([1300n]), "Afternoon!");
    assert.equal(await c.read.doNotDisturb([1799n]), "Afternoon!");
    assert.equal(await c.read.doNotDisturb([1800n]), "Evening!");
    assert.equal(await c.read.doNotDisturb([2200n]), "Evening!");
  });

  it("doNotDisturb reverts with custom errors for AfterHours and AtLunch", async function () {
    const c = await viem.deployContract("ControlStructures");

    await assert.rejects(c.read.doNotDisturb([759n]));
    await assert.rejects(c.read.doNotDisturb([2210n]));
    await assert.rejects(c.read.doNotDisturb([1200n]));
    await assert.rejects(c.read.doNotDisturb([1299n]));
  });
});


