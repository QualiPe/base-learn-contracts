import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("HaikuNFT", async function () {
  const { viem } = await network.connect();

  it("mints unique haiku, increments counter, stores content", async function () {
    const c = await viem.deployContract("HaikuNFT");

    const before = (await c.read.counter()) as bigint;
    await c.write.mintHaiku(["L1", "L2", "L3"]);
    const after = (await c.read.counter()) as bigint;
    assert.equal(Number(after - before), 1);

    const shared = (await c.read.getMySharedHaikus()) as unknown as Array<{
      author: string;
      line1: string;
      line2: string;
      line3: string;
    }>;
    assert.equal(shared.length, 0);
  });

  it("reverts when any line duplicates existing haiku lines", async function () {
    const c = await viem.deployContract("HaikuNFT");
    await c.write.mintHaiku(["A", "B", "C"]);
    await assert.rejects(c.write.mintHaiku(["X", "B", "Y"]));
    await assert.rejects(c.write.mintHaiku(["A", "Z", "Z"]));
    await assert.rejects(c.write.mintHaiku(["Z", "Z", "C"]));
  });

  it("share and retrieval respects ownership and target visibility", async function () {
    const c = await viem.deployContract("HaikuNFT");
    const wallets = await viem.getWalletClients();

    await c.write.mintHaiku(["H1", "H2", "H3"], { account: wallets[0].account });

    await assert.rejects(c.write.shareHaiku([1n, wallets[1].account.address], { account: wallets[1].account }));

    await c.write.shareHaiku([1n, wallets[1].account.address], { account: wallets[0].account });

    const as1 = (await c.read.getMySharedHaikus({ account: wallets[1].account })) as unknown as Array<{
      author: string;
      line1: string;
      line2: string;
      line3: string;
    }>;
    assert.equal(as1.length, 1);
    assert.equal(as1[0].line1, "H1");

    await assert.rejects(c.read.getMySharedHaikus({ account: wallets[2].account }));
  });
});


