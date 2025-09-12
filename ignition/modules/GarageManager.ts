import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GarageManagerModule", (m) => {
  const garage = m.contract("GarageManager");
  return { garage };
});


