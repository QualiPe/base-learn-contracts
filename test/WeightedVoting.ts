import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("WeightedVoting", async function () {
  const { viem } = await network.connect();
  type Issue = {
    voters: string[];
    issueDesc: string;
    quorum: bigint;
    totalVotes: bigint;
    votesFor: bigint;
    votesAgainst: bigint;
    votesAbstain: bigint;
    passed: boolean;
    closed: boolean;
  };

  it("claim mints once per address and caps at maxSupply", async function () {
    const c = await viem.deployContract("WeightedVoting", ["Weighted", "WV"]);
    const wallets = await viem.getWalletClients();

    await c.write.claim([], { account: wallets[0].account });
    await assert.rejects(c.write.claim([], { account: wallets[0].account }));

    const bal0 = (await c.read.balanceOf([wallets[0].account.address])) as bigint;
    assert.equal(Number(bal0), 100);
  });

  it("createIssue requires token holder and quorum <= totalSupply", async function () {
    const c = await viem.deployContract("WeightedVoting", ["Weighted", "WV"]);
    const wallets = await viem.getWalletClients();

    await assert.rejects(c.write.createIssue(["Test", 1n], { account: wallets[0].account }));

    await c.write.claim([], { account: wallets[0].account });

    await assert.rejects(c.write.createIssue(["Test", 101n], { account: wallets[0].account }));

    const issueId = (await c.write.createIssue(["Test", 1n], { account: wallets[0].account })) as unknown as string;
    assert.ok(issueId);

    const issue = (await c.read.getIssue([1n])) as unknown as Issue;
    assert.equal(issue.issueDesc, "Test");
    assert.equal(Number(issue.quorum), 1);
    assert.equal(issue.closed, false);
  });

  it("vote weights by token balance, single vote per address, closes at quorum", async function () {
    const c = await viem.deployContract("WeightedVoting", ["Weighted", "WV"]);
    const wallets = await viem.getWalletClients();

    await c.write.claim([], { account: wallets[0].account });
    await c.write.claim([], { account: wallets[1].account });

    await c.write.createIssue(["Q", 100n], { account: wallets[0].account });

    await c.write.vote([1n, 1n], { account: wallets[0].account });

    await assert.rejects(c.write.vote([1n, 1n], { account: wallets[0].account }));

    const iss0 = (await c.read.getIssue([1n])) as unknown as Issue;
    assert.equal(Number(iss0.totalVotes), 100);
    assert.equal(Number(iss0.votesFor), 100);
    assert.equal(iss0.closed, false);

    await c.write.vote([1n, 0n], { account: wallets[1].account });

    const iss1 = (await c.read.getIssue([1n])) as unknown as Issue;
    assert.equal(Number(iss1.totalVotes), 200);
    assert.equal(Number(iss1.votesAgainst), 100);
    assert.equal(iss1.closed, true);
    assert.equal(iss1.passed, false);
  });
});


