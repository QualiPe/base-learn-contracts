// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AddressBook is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
    string private salt = "value";

    struct Contact {
        uint256 id;
        string firstName;
        string lastName;
        uint256[] phoneNumbers;
    }

    Contact[] private contacts;
    mapping(uint256 => uint256) private idToIndex;
    uint256 private nextId = 1;

    error ContactNotFound(uint256 id);

    function addContact(string calldata firstName, string calldata lastName, uint256[] calldata phoneNumbers) external onlyOwner {
        contacts.push(Contact(nextId, firstName, lastName, phoneNumbers));
        idToIndex[nextId] = contacts.length - 1;
        nextId++;
    }

    function deleteContact(uint256 id) external onlyOwner {
        uint256 index = idToIndex[id];
        if (index >= contacts.length || contacts[index].id != id) revert ContactNotFound(id);

        contacts[index] = contacts[contacts.length - 1];
        idToIndex[contacts[index].id] = index;
        contacts.pop();
        delete idToIndex[id];
    }

    function getContact(uint256 id) external view returns (Contact memory) {
        uint256 index = idToIndex[id];
        if (index >= contacts.length || contacts[index].id != id) revert ContactNotFound(id);
        return contacts[index];
    }

    function getAllContacts() external view returns (Contact[] memory) {
        return contacts;
    }
}


