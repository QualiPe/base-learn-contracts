import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("UnburnableTokenModule", (m) => {
  const token = m.contract("UnburnableToken");
  return { token };
});
