import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import * as path from "path";

// Load the .env from the backend directory so we share the same keys
dotenv.config({ path: path.join(__dirname, "..", "aura-ai", ".env") });

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    botchainTestnet: {
      url: process.env.BOT_CHAIN_TESTNET_RPC_URL || "https://rpc.bohr.life",
      chainId: parseInt(process.env.BOT_CHAIN_TESTNET_CHAIN_ID || "968"),
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : []
    },
    botchainMainnet: {
      url: process.env.BOT_CHAIN_MAINNET_RPC_URL || process.env.BOT_CHAIN_RPC_URL || "https://rpc.botchain.ai",
      chainId: parseInt(process.env.BOT_CHAIN_MAINNET_CHAIN_ID || process.env.BOT_CHAIN_CHAIN_ID || "677"),
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : []
    }
  }
};

export default config;
