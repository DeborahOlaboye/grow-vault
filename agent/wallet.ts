import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";

if (!process.env.AGENT_PRIVATE_KEY) throw new Error("AGENT_PRIVATE_KEY not set in .env");

export const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as `0x${string}`);
export const agentAddress = account.address;

export const publicClient = createPublicClient({
  chain: celo,
  transport: http("https://forno.celo.org"),
});

export const walletClient = createWalletClient({
  account,
  chain: celo,
  transport: http("https://forno.celo.org"),
});
