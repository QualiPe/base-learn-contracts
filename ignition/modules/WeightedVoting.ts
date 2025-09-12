import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("WeightedVotingModule", (m) => {
  const token = m.contract("WeightedVoting", ["WeightedVoting", "WV"]);
  return { token };
});


