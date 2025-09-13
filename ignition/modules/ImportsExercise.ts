import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ImportsExerciseModule", (m) => {
  const imp = m.contract("ImportsExercise");
  return { imp };
});



