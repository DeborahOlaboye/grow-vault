// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GrowVault is Ownable, ReentrancyGuard {
    IERC20 public immutable cUSD;

    enum LockMode { SOFT, HARD }

    struct Goal {
        address owner;
        string name;
        string emoji;
        uint256 targetAmount;
        uint256 savedAmount;
        uint256 deadline;
        LockMode lockMode;
        bool completed;
        bool withdrawn;
        uint256 createdAt;
        uint8 milestonesClaimed;
    }

    constructor(address _cUSD) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
    }
}
