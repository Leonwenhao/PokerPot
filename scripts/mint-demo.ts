const { ethers } = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("Missing DEPLOYER_PRIVATE_KEY in environment.");
  }
  const deployer = signers[0];

  const contractsPath = path.resolve(__dirname, "../lib/contracts.ts");
  const contractsRaw = fs.readFileSync(contractsPath, "utf8");
  const baseIndex = contractsRaw.indexOf("baseSepolia");
  if (baseIndex === -1) {
    throw new Error("Could not find baseSepolia in lib/contracts.ts");
  }
  const baseSlice = contractsRaw.slice(baseIndex);
  const match = baseSlice.match(/mockUsdc:\s*"([^"]+)"/);
  if (!match) {
    throw new Error(
      "Could not find baseSepolia mockUsdc address in lib/contracts.ts"
    );
  }
  const mockUsdcAddress = match[1];
  const mockUsdc = await ethers.getContractAt("MockUSDC", mockUsdcAddress);

  const amount = ethers.utils.parseUnits("10000", 6);
  const extraAddresses = process.argv.slice(2);
  const targets = new Set([deployer.address, ...extraAddresses]);

  console.log("Minting MockUSDC on Base Sepolia:", mockUsdcAddress);

  for (const target of targets) {
    console.log("Minting to:", target);
    const tx = await mockUsdc.mint(target, amount);
    await tx.wait();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
