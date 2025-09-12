import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("InheritanceSubmissionModule", (m) => {
  const salesperson = m.contract("Salesperson", [55555, 12345, 20]);
  const engineeringManager = m.contract("EngineeringManager", [54321, 11111, 200000]);
  const submission = m.contract("InheritanceSubmission", [salesperson, engineeringManager]);

  return { salesperson, engineeringManager, submission };
});


