import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: { version: "0.8.20", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    alfajores: { url: "https://alfajores-forno.celo-testnet.org", accounts: [], chainId: 44787 },
    celo: { url: "https://forno.celo.org", accounts: [], chainId: 42220 },
  },
};
export default config;
