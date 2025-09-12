import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FavoriteRecordsModule", (m) => {
  const fav = m.contract("FavoriteRecords");
  return { fav };
});


