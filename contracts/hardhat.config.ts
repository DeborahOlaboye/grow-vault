import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    alfajores: { url: "https://alfajores-forno.celo-testnet.org", accounts: [], chainId: 44787 },
  },
};
export default config;
