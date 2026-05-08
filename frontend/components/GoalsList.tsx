"use client";

import { useAccount, useChainId } from "wagmi";
import { GROW_VAULT_ADDRESS } from "@/lib/contracts";

export default function GoalsList() {
  const { address } = useAccount();
  const chainId = useChainId() as 42220 | 44787;
  const contractAddress = GROW_VAULT_ADDRESS[chainId];

  return <div className="space-y-4">Loading goals...</div>;
}
