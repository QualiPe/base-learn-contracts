// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./AddressBook.sol";

contract AddressBookFactory {
    event Deployed(address indexed owner, address indexed book);

    function deploy() external returns (address addr) {
        AddressBook book = new AddressBook(msg.sender);
        emit Deployed(msg.sender, address(book));
        return address(book);
    }
}


