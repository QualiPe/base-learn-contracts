import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BasicMathV2Module", (m) => {
  const basicMath = m.contract("BasicMath");
  return { basicMath };
});


