import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("InheritanceSubmission", async function () {
  const { viem } = await network.connect();

  it("Salaried.getAnnualCost returns salary; Hourly uses 2080 multiplier", async function () {
    const salaried = await viem.deployContract("Salaried", [1, 100, 50000]);
    const hourly = await viem.deployContract("Hourly", [2, 200, 50]);

    const salariedCost = (await salaried.read.getAnnualCost()) as bigint;
    const hourlyCost = (await hourly.read.getAnnualCost()) as bigint;

    assert.equal(Number(salariedCost), 50000);
    assert.equal(Number(hourlyCost), 50 * 2080);
  });

  it("Manager manages employeeIds, resetReports clears", async function () {
    const manager = await viem.deployContract("EngineeringManager", [10, 1, 120000]);

    await manager.write.addReport([101]);
    await manager.write.addReport([102]);

    const id0 = await manager.read.employeeIds([0n]);
    const id1 = await manager.read.employeeIds([1n]);
    assert.equal(Number(id0), 101);
    assert.equal(Number(id1), 102);

    await manager.write.resetReports();

    // After reset, length is 0; accessing index 0 should revert.
    await assert.rejects(manager.read.employeeIds([0n]));
  });

  it("Salesperson and EngineeringManager deploy and wire into InheritanceSubmission", async function () {
    const sp = await viem.deployContract("Salesperson", [3, 10, 20]);
    const em = await viem.deployContract("EngineeringManager", [4, 10, 150000]);

    const sub = await viem.deployContract("InheritanceSubmission", [sp.address, em.address]);
    const spAddr = await sub.read.salesPerson();
    const emAddr = await sub.read.engineeringManager();

    assert.equal(spAddr, sp.address);
    assert.equal(emAddr, em.address);
  });
});


