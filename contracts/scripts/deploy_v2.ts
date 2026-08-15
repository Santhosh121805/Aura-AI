import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AuraStrategyRegistryV2 with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "BOT");

  const Registry = await ethers.getContractFactory("AuraStrategyRegistryV2");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const tx = registry.deploymentTransaction();
  const receipt = await tx?.wait();

  console.log("AuraStrategyRegistryV2 deployed to:", address);
  console.log("Deployment Tx Hash:", tx?.hash);
  console.log("Gas Used:", receipt?.gasUsed ? receipt.gasUsed.toString() : "N/A");
  console.log("\nUpdate these env files after deployment:");
  console.log(`  aura-ai/.env         -> REGISTRY_CONTRACT_ADDRESS_V2=${address}`);
  console.log(`  frontend/.env        -> VITE_REGISTRY_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
