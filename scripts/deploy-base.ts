const { ethers } = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");

function upsertBaseSepoliaConfig(existing, configBlock) {
  if (!existing || !existing.trim()) {
    return `export const CONTRACTS = {\n${configBlock}\n} as const;\n`;
  }

  if (existing.includes("baseSepolia:")) {
    return existing;
  }

  const insertPoint = existing.lastIndexOf("} as const;");
  if (insertPoint === -1) {
    return `export const CONTRACTS = {\n${configBlock}\n} as const;\n`;
  }

  const before = existing.slice(0, insertPoint);
  const after = existing.slice(insertPoint);
  const separator = before.trim().endsWith("}") ? ",\n" : "\n";

  return `${before}${separator}${configBlock}\n${after}`;
}

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("Missing DEPLOYER_PRIVATE_KEY in environment.");
  }
  const deployer = signers[0];

  console.log("Deploying to Base Sepolia with:", deployer.address);

  const feeData = await ethers.provider.getFeeData();
  const latestBlock = await ethers.provider.getBlock("latest");
  const baseFee = latestBlock && latestBlock.baseFeePerGas
    ? latestBlock.baseFeePerGas
    : ethers.utils.parseUnits("1", "gwei");
  const maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas || ethers.utils.parseUnits("2", "gwei");
  const maxFeePerGas = baseFee.mul(5).add(maxPriorityFeePerGas);
  console.log("Using maxFeePerGas:", maxFeePerGas.toString());

  console.log("Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUsdc = await MockUSDC.deploy({
    maxFeePerGas,
    maxPriorityFeePerGas
  });
  await mockUsdc.deployed();
  const mockUsdcAddress = mockUsdc.address;
  console.log("MockUSDC deployed:", mockUsdcAddress);

  const latestNonce = await deployer.getTransactionCount("latest");
  const pendingNonce = await deployer.getTransactionCount("pending");
  console.log("Nonce latest:", latestNonce, "pending:", pendingNonce);
  const escrowNonce = pendingNonce;
  console.log("Deploying PokerPotEscrow...");
  const PokerPotEscrow = await ethers.getContractFactory("PokerPotEscrow");
  const escrow = await PokerPotEscrow.deploy(mockUsdcAddress, deployer.address, {
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce: escrowNonce
  });
  await escrow.deployed();
  const escrowAddress = escrow.address;

  console.log("PokerPotEscrow deployed:", escrowAddress);

  const contractsPath = path.resolve(process.cwd(), "lib", "contracts.ts");
  const existing = fs.existsSync(contractsPath)
    ? fs.readFileSync(contractsPath, "utf8")
    : "";

  const configBlock = `  baseSepolia: {\n    chainId: 84532,\n    rpcUrl: \"https://sepolia.base.org\",\n    explorer: \"https://sepolia.basescan.org\",\n    mockUsdc: \"${mockUsdcAddress}\",\n    escrow: \"${escrowAddress}\",\n    host: \"${deployer.address}\"\n  }`;

  const updated = upsertBaseSepoliaConfig(existing, configBlock);
  fs.writeFileSync(contractsPath, updated, "utf8");
  console.log("Saved addresses to", contractsPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
