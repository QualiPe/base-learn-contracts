import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("ImportsExercise", async function () {
  const { viem } = await network.connect();

  it("saveHaiku and getHaiku store and return values", async function () {
    const c = await viem.deployContract("ImportsExercise");
    await c.write.saveHaiku(["An old silent pond", "A frog jumps into the pond—", "Splash! Silence again."]);

    const h = (await c.read.getHaiku()) as { line1: string; line2: string; line3: string };
    assert.equal(h.line1, "An old silent pond");
    assert.equal(h.line2, "A frog jumps into the pond—");
    assert.equal(h.line3, "Splash! Silence again.");
  });

  it("shruggieHaiku appends shruggie to line3", async function () {
    const c = await viem.deployContract("ImportsExercise");
    await c.write.saveHaiku(["In the twilight rain", "these brilliant-hued hibiscus—", "A lovely sunset"]);

    const h = (await c.read.shruggieHaiku()) as { line1: string; line2: string; line3: string };
    assert.equal(h.line3.endsWith(" 🤷"), true);
  });
});


