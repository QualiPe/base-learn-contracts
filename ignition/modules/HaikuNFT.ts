import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("HaikuNFTModule", (m) => {
  const nft = m.contract("HaikuNFT");
  return { nft };
});


