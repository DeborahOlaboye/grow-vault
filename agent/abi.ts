export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`;
export const GROW_VAULT_ADDRESS = "0x2be5780ad75a71f39040f044cbf92e745731de44" as `0x${string}`;

export const GROW_VAULT_ABI = [
  {
    name: "totalGoals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "goals",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "name", type: "string" },
      { name: "emoji", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "savedAmount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "lockMode", type: "uint8" },
      { name: "completed", type: "bool" },
      { name: "withdrawn", type: "bool" },
      { name: "createdAt", type: "uint256" },
      { name: "milestonesClaimed", type: "uint8" },
    ],
  },
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "goalId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
