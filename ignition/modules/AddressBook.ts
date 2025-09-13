import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AddressBookModule", (m) => {
  const book = m.contract("AddressBook", [m.getAccount(0)]);
  return { book };
});



