import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EmployeeStorageModule", (m) => {
  const employee = m.contract("EmployeeStorage", [1000, "Alice", 5000, 42n]);
  return { employee };
});


