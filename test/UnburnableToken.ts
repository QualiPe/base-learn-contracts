import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("UnburnableToken", async function () {
  const { viem } = await network.connect();

  it("claim mints 1000 once per address and caps at totalSupply", async function () {
    const c = await viem.deployContract("UnburnableToken");
    const wallets = await viem.getWalletClients();

    await c.write.claim([], { account: wallets[0].account });
    await assert.rejects(c.write.claim([], { account: wallets[0].account }));

    const bal0 = (await c.read.balances([wallets[0].account.address])) as bigint;
    assert.equal(Number(bal0), 1000);
  });

  it("safeTransfer reverts for zero or zero-balance recipients; transfers when ok", async function () {
    const c = await viem.deployContract("UnburnableToken");
    const wallets = await viem.getWalletClients();

    await c.write.claim([], { account: wallets[0].account });

    await assert.rejects(c.write.safeTransfer(["0x0000000000000000000000000000000000000000", 1n], { account: wallets[0].account }));

    await assert.rejects(c.write.safeTransfer([wallets[1].account.address, 1n], { account: wallets[0].account }));

    // Fund recipient with ETH to make balance > 0 and pass safety check
    const publicClient = await viem.getPublicClient();
    const txHash = await wallets[0].sendTransaction({ to: wallets[1].account.address, value: 1n });
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    await c.write.safeTransfer([wallets[1].account.address, 100n], { account: wallets[0].account });
    const b0 = (await c.read.balances([wallets[0].account.address])) as bigint;
    const b1 = (await c.read.balances([wallets[1].account.address])) as bigint;
    assert.equal(Number(b0), 900);
    assert.equal(Number(b1), 100);
  });
});


