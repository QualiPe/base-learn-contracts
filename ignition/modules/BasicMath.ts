import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BasicMathModule", (m) => {
  const basicMath = m.contract("BasicMath");
  return { basicMath };
});


