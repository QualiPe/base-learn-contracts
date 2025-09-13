import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ErrorTriageExerciseModule", (m) => {
  const triage = m.contract("ErrorTriageExercise");
  return { triage };
});



