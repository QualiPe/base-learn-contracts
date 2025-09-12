import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EmployeeStorageV2Module", (m) => {
  const employee = m.contract("EmployeeStorage", [1000, "Pat", 50000, 112358132134n]);
  return { employee };
});


