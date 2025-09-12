import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ControlStructuresModule", (m) => {
  const control = m.contract("ControlStructures");
  return { control };
});


