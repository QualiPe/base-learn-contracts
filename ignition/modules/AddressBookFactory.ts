import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AddressBookFactoryModule", (m) => {
  const factory = m.contract("AddressBookFactory");
  return { factory };
});



