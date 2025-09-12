// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BasicMath {
    uint256 public constant MAX_UINT256 = type(uint256).max;
    uint256 public constant MAX_INT = type(uint256).max;

    function add(uint256 a, uint256 b) external pure returns (uint256 sum, bool error) {
        unchecked {
            if (b > MAX_UINT256 - a) return (0, true);
            return (a + b, false);
        }
    }

    function sub(uint256 a, uint256 b) external pure returns (uint256 difference, bool error) {
        unchecked {
            if (b > a) return (0, true);
            return (a - b, false);
        }
    }

    function adder(uint256 a, uint256 b) external pure returns (uint256 sum, bool error) {
        unchecked {
            if (b > MAX_UINT256 - a) return (0, true);
            return (a + b, false);
        }
    }

    function subtractor(uint256 a, uint256 b) external pure returns (uint256 difference, bool error) {
        unchecked {
            if (b > a) return (0, true);
            return (a - b, false);
        }
    }
}