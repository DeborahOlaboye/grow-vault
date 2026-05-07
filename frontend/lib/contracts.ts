export const CUSD_ADDRESS = {
  42220: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  44787: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
} as const;

export const GROW_VAULT_ADDRESS = {
  42220: "" as `0x${string}`,
  44787: "" as `0x${string}`,
} as const;

export const GROW_VAULT_ABI = [
  {
    name: "createGoal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "emoji", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "lockMode", type: "uint8" },
    ],
    outputs: [{ name: "goalId", type: "uint256" }],
  },
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256" }, { name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "claimMilestone",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getUserGoals",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
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
    name: "getProgress",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [{ name: "pct", type: "uint256" }],
  },
  {
    name: "getContributors",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [{ name: "", type: "address[]" }],
  },
] as const;
