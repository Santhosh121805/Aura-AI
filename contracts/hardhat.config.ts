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
      // Use the BOT Chain Testnet RPC from .env or fallback to a placeholder
      url: process.env.BOT_CHAIN_RPC_URL || "https://rpc-testnet.botchain.ai",
      chainId: parseInt(process.env.BOT_CHAIN_CHAIN_ID || "677"),
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : []
    }
  }
};

export default config;
