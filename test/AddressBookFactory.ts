import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("AddressBookFactory", async function () {
  const { viem } = await network.connect();

  it("deploy creates AddressBook with caller as owner", async function () {
    const factory = await viem.deployContract("AddressBookFactory");
    const wallets = await viem.getWalletClients();

    const owner0 = wallets[0].account;
    const owner1 = wallets[1].account;

    const addr0 = (await factory.read.deploy({ account: owner0 })) as string;
    const book0 = await viem.getContractAt("AddressBook", addr0);

    // owner0 can add, owner1 cannot
    await book0.write.addContact(["A", "B", [123n]], { account: owner0 });
    await assert.rejects(book0.write.addContact(["X", "Y", [999n]], { account: owner1 }));

    const list = (await book0.read.getAllContacts()) as any[];
    assert.equal(list.length, 1);

    // Another deployment by owner1 produces a separate book owned by owner1
    const addr1 = (await factory.read.deploy({ account: owner1 })) as string;
    const book1 = await viem.getContractAt("AddressBook", addr1);
    await book1.write.addContact(["C", "D", [777n]], { account: owner1 });
    const list1 = (await book1.read.getAllContacts()) as any[];
    assert.equal(list1.length, 1);
  });
});


