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

    uint256 public constant SOFT_LOCK_PENALTY_BPS = 500;
    uint256 public constant BPS_DENOMINATOR = 10000;

    uint256 private _goalCounter;

    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public userGoals;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public contributors;

    uint256 public penaltyPool;

    event GoalCreated(uint256 indexed goalId, address indexed owner, string name, uint256 target, uint256 deadline);
    event Deposited(uint256 indexed goalId, address indexed contributor, uint256 amount);
    event Withdrawn(uint256 indexed goalId, address indexed owner, uint256 amount, uint256 penalty);
    event GoalCompleted(uint256 indexed goalId);
    event MilestoneClaimed(uint256 indexed goalId, uint8 milestone);

    constructor(address _cUSD) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
    }
}
