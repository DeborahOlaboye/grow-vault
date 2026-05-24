import "dotenv/config";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRATION_JSON_PATH = path.resolve(__dirname, "../registration.json");

const IDENTITY_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as `0x${string}`;

const REGISTRY_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "register",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentURI", type: "string" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
] as const;

async function uploadToPinata(json: object): Promise<string> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) throw new Error("PINATA_JWT not set in .env");

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      pinataContent: json,
      pinataMetadata: { name: "growvault-agent-registration" },
    }),
  });

  if (!res.ok) throw new Error(`Pinata upload failed: ${await res.text()}`);
  const data = (await res.json()) as { IpfsHash: string };
  return `ipfs://${data.IpfsHash}`;
}

async function main() {
  console.log("\n════════════════════════════════════════════════════");
  console.log("  GrowVault Agent  |  ERC-8004 Registration");
  console.log("════════════════════════════════════════════════════\n");

  if (!process.env.AGENT_PRIVATE_KEY) throw new Error("AGENT_PRIVATE_KEY not set in .env");

  const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as `0x${string}`);
  console.log("Agent wallet :", account.address);
  console.log("Registry     :", IDENTITY_REGISTRY);

  const publicClient = createPublicClient({ chain: celo, transport: http("https://forno.celo.org") });
  const walletClient = createWalletClient({ account, chain: celo, transport: http("https://forno.celo.org") });

  // Check if already registered
  const balance = await publicClient.readContract({
    address: IDENTITY_REGISTRY,
    abi: REGISTRY_ABI,
    functionName: "balanceOf",
    args: [account.address],
  });

  if (balance > 0n) {
    console.log("\n✓ Agent already registered with ERC-8004");
    console.log(`  Check: https://8004scan.io/agents/celo`);
    return;
  }

  const registration = JSON.parse(readFileSync(REGISTRATION_JSON_PATH, "utf-8"));

  console.log("\nUploading registration.json to IPFS via Pinata...");
  const ipfsUri = await uploadToPinata(registration);
  console.log("IPFS URI:", ipfsUri);

  console.log("\nCalling Identity Registry on Celo mainnet...");
  const tx = await walletClient.writeContract({
    address: IDENTITY_REGISTRY,
    abi: REGISTRY_ABI,
    functionName: "register",
    args: [ipfsUri],
  });
  console.log("Transaction:", `https://celoscan.io/tx/${tx}`);

  console.log("Waiting for confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

  // Extract token ID from Transfer event (topic[3] = tokenId)
  const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
  const log = receipt.logs.find((l) => l.topics[0] === transferTopic);
  const tokenId = log ? BigInt(log.topics[3] ?? "0x0") : null;

  console.log("\n════════════════════════════════════════════════════");
  console.log("  ✓ Registration complete!");
  console.log(`  Agent ID  : ${tokenId}`);
  console.log(`  8004scan  : https://8004scan.io/agents/celo/${tokenId}`);
  console.log(`  Tx        : https://celoscan.io/tx/${tx}`);
  console.log("════════════════════════════════════════════════════\n");
}

main().catch((e) => { console.error("Error:", e.message); process.exit(1); });
