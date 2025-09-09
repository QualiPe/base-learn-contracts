import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("GarageManager", async function () {
  const { viem } = await network.connect();

  it("addCar adds cars and getMyCars returns them", async function () {
    const c = await viem.deployContract("GarageManager");

    await c.write.addCar(["Toyota", "Corolla", "Blue", 4]);
    await c.write.addCar(["Tesla", "Model 3", "Red", 4]);

    const myCars = (await c.read.getMyCars()) as Array<{
      make: string;
      model: string;
      color: string;
      numberOfDoors: bigint;
    }>;

    assert.equal(myCars.length, 2);
    assert.equal(myCars[0].make, "Toyota");
    assert.equal(myCars[0].model, "Corolla");
    assert.equal(myCars[0].color, "Blue");
    assert.equal(myCars[0].numberOfDoors, 4n);
    assert.equal(myCars[1].make, "Tesla");
  });

  it("getUserCars returns cars for specified user", async function () {
    const c = await viem.deployContract("GarageManager");
    const wallets = await viem.getWalletClients();

    await c.write.addCar(["VW", "Golf", "Green", 4], { account: wallets[0].account });
    await c.write.addCar(["BMW", "X5", "Black", 4], { account: wallets[1].account });

    const a0 = wallets[0].account.address;
    const a1 = wallets[1].account.address;

    const u0 = (await c.read.getUserCars([a0])) as any[];
    const u1 = (await c.read.getUserCars([a1])) as any[];

    assert.equal(u0.length, 1);
    assert.equal(u0[0].make, "VW");
    assert.equal(u1.length, 1);
    assert.equal(u1[0].make, "BMW");
  });

  it("updateCar updates specific car and reverts on bad index", async function () {
    const c = await viem.deployContract("GarageManager");

    await c.write.addCar(["Ford", "Focus", "White", 4]);
    await c.write.updateCar([0n, "Ford", "Fiesta", "Yellow", 2]);

    const myCars = (await c.read.getMyCars()) as any[];
    assert.equal(myCars[0].model, "Fiesta");
    assert.equal(myCars[0].color, "Yellow");
    assert.equal(myCars[0].numberOfDoors, 2n);

    await assert.rejects(c.write.updateCar([1n, "A", "B", "C", 2]));
  });

  it("resetMyGarage clears all cars for caller only", async function () {
    const c = await viem.deployContract("GarageManager");
    const wallets = await viem.getWalletClients();

    await c.write.addCar(["Opel", "Corsa", "Silver", 4], { account: wallets[0].account });
    await c.write.addCar(["Audi", "A4", "Black", 4], { account: wallets[1].account });

    await c.write.resetMyGarage([], { account: wallets[0].account });

    const a0 = wallets[0].account.address;
    const a1 = wallets[1].account.address;

    const u0 = (await c.read.getUserCars([a0])) as any[];
    const u1 = (await c.read.getUserCars([a1])) as any[];

    assert.equal(u0.length, 0);
    assert.equal(u1.length, 1);
    assert.equal(u1[0].make, "Audi");
  });
});


