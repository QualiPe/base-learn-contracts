import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("FavoriteRecords", async function () {
  const { viem } = await network.connect();

  const approved = [
    "Thriller",
    "Back in Black",
    "The Bodyguard",
    "The Dark Side of the Moon",
    "Their Greatest Hits (1971-1975)",
    "Hotel California",
    "Come On Over",
    "Rumours",
    "Saturday Night Fever",
  ];

  it("initial approved list matches", async function () {
    const c = await viem.deployContract("FavoriteRecords");
    const list = (await c.read.getApprovedRecords()) as string[];
    assert.deepEqual(list, approved);
  });

  it("addRecord adds approved items and is idempotent per user", async function () {
    const c = await viem.deployContract("FavoriteRecords");
    await c.write.addRecord(["Thriller"]);
    await c.write.addRecord(["Thriller"]);
    const favs = (await c.read.getUserFavorites([ (await viem.getWalletClients())[0].account.address ])) as string[];
    assert.deepEqual(favs, ["Thriller"]);
  });

  it("addRecord reverts for unapproved items", async function () {
    const c = await viem.deployContract("FavoriteRecords");
    await assert.rejects(c.write.addRecord(["Nonexistent Album"]));
  });

  it("favorites are per-user and independent", async function () {
    const c = await viem.deployContract("FavoriteRecords");
    const wallets = await viem.getWalletClients();
    const a0 = wallets[0].account.address;
    const a1 = wallets[1].account.address;

    // user0 adds Thriller
    await c.write.addRecord(["Thriller"], { account: wallets[0].account });
    // user1 adds Rumours
    await c.write.addRecord(["Rumours"], { account: wallets[1].account });

    const u0 = (await c.read.getUserFavorites([a0])) as string[];
    const u1 = (await c.read.getUserFavorites([a1])) as string[];
    assert.deepEqual(u0, ["Thriller"]);
    assert.deepEqual(u1, ["Rumours"]);
  });

  it("resetUserFavorites clears only caller's list", async function () {
    const c = await viem.deployContract("FavoriteRecords");
    const wallets = await viem.getWalletClients();
    const a0 = wallets[0].account.address;
    const a1 = wallets[1].account.address;

    await c.write.addRecord(["Thriller"], { account: wallets[0].account });
    await c.write.addRecord(["Rumours"], { account: wallets[1].account });

    await c.write.resetUserFavorites([], { account: wallets[0].account });

    const u0 = (await c.read.getUserFavorites([a0])) as string[];
    const u1 = (await c.read.getUserFavorites([a1])) as string[];
    assert.equal(u0.length, 0);
    assert.deepEqual(u1, ["Rumours"]);
  });
});


