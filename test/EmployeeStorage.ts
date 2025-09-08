import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("EmployeeStorage", async function () {
  const { viem } = await network.connect();

  it("constructor sets initial state and getters return values", async function () {
    const employee = await viem.deployContract("EmployeeStorage", [1000, "Alice", 5000, 42n]);

    assert.equal(Number(await employee.read.viewShares()), 1000);
    assert.equal(Number(await employee.read.viewSalary()), 5000);
    assert.equal(await employee.read.name(), "Alice");
    assert.equal(Number(await employee.read.idNumber()), 42);
  });

  it("grantShares succeeds within limit", async function () {
    const employee = await viem.deployContract("EmployeeStorage", [1000, "Bob", 7000, 7n]);
    await employee.write.grantShares([500]);
    assert.equal(Number(await employee.read.viewShares()), 1500);
  });

  it("grantShares reverts when _newShares > 5000 (string revert)", async function () {
    const employee = await viem.deployContract("EmployeeStorage", [1000, "Bob", 7000, 7n]);
    await assert.rejects(employee.write.grantShares([5001]));
  });

  it("grantShares reverts with TooManyShares when exceeding total limit", async function () {
    const employee = await viem.deployContract("EmployeeStorage", [4900, "Bob", 7000, 7n]);
    await assert.rejects(employee.write.grantShares([200]));
  });

  it("debugResetShares resets to 1000", async function () {
    const employee = await viem.deployContract("EmployeeStorage", [10, "Eve", 1000, 1n]);
    await employee.write.debugResetShares();
    assert.equal(Number(await employee.read.viewShares()), 1000);
  });
});


