// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library SillyStringUtils {
    struct Haiku {
        string line1;
        string line2;
        string line3;
    }

    function shruggie(string memory self) internal pure returns (string memory) {
        return string.concat(self, unicode" 🤷");
    }
}


