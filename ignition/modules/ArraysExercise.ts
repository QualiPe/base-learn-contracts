import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ArraysExerciseModule", (m) => {
  const arrays = m.contract("ArraysExercise");
  return { arrays };
});


