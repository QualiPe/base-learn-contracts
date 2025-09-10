import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("AddressBook", async function () {
  const { viem } = await network.connect();

  it("owner can add and get contacts; non-owner cannot", async function () {
    const wallets = await viem.getWalletClients();
    const owner = wallets[0].account;
    const other = wallets[1].account;

    const c = await viem.deployContract("AddressBook", [owner.address]);

    await c.write.addContact(["Alice", "Smith", [111n, 222n]], { account: owner });
    const list1 = (await c.read.getAllContacts()) as any[];
    assert.equal(list1.length, 1);
    assert.equal(list1[0].firstName, "Alice");

    await assert.rejects(c.write.addContact(["Bob", "Jones", [333n]], { account: other }));
  });

  it("getContact returns correct entry; deleteContact removes it", async function () {
    const wallets = await viem.getWalletClients();
    const owner = wallets[0].account;
    const c = await viem.deployContract("AddressBook", [owner.address]);

    await c.write.addContact(["Alice", "Smith", [111n, 222n]], { account: owner });
    await c.write.addContact(["Bob", "Jones", [333n]], { account: owner });

    const contact1 = (await c.read.getContact([1])) as any;
    assert.equal(contact1.lastName, "Smith");
    assert.deepEqual(contact1.phoneNumbers.map((n: bigint) => Number(n)), [111, 222]);

    await c.write.deleteContact([1], { account: owner });

    const all = (await c.read.getAllContacts()) as any[];
    assert.equal(all.length, 1);
    assert.equal(all[0].id, 2n);

    await assert.rejects(c.read.getContact([1]));
  });
});


