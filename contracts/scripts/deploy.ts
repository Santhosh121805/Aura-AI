import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Registry = await ethers.getContractFactory("AuraStrategyRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const tx = registry.deploymentTransaction();
  const receipt = await tx?.wait();

  console.log("AuraStrategyRegistry deployed to:", address);
  console.log("Deployment Tx Hash:", tx?.hash);
  console.log("Gas Used:", receipt?.gasUsed ? receipt.gasUsed.toString() : "N/A");
  console.log("\nAdd this to your aura-ai/.env file:");
  console.log(`REGISTRY_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
