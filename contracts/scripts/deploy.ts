import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const GrowVault = await ethers.getContractFactory("GrowVault");
  const contract = await GrowVault.deploy("0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1");
  await contract.waitForDeployment();
  console.log("GrowVault deployed to:", await contract.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
