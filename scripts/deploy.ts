const { ethers } = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("Missing DEPLOYER_PRIVATE_KEY in environment.");
  }
  const deployer = signers[0];

  console.log("Deploying with:", deployer.address);
  const gasPrice = await ethers.provider.getGasPrice();
  const bumpedGasPrice = gasPrice.mul(12).div(10);
  const startNonce = await deployer.getTransactionCount("pending");
  console.log("Using gas price:", bumpedGasPrice.toString(), "nonce:", startNonce);

  console.log("Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const initialSupply = ethers.utils.parseUnits("1000000", 6);
  const mockUsdc = await MockUSDC.deploy(initialSupply, {
    gasPrice: bumpedGasPrice,
    nonce: startNonce
  });
  await mockUsdc.deployed();
  const mockUsdcAddress = mockUsdc.address;

  console.log("MockUSDC deployed:", mockUsdcAddress);

  console.log("Deploying PokerPotEscrow...");
  const PokerPotEscrow = await ethers.getContractFactory("PokerPotEscrow");
  const escrow = await PokerPotEscrow.deploy(mockUsdcAddress, deployer.address, {
    gasPrice: bumpedGasPrice,
    nonce: startNonce + 1
  });
  await escrow.deployed();
  const escrowAddress = escrow.address;

  console.log("PokerPotEscrow deployed:", escrowAddress);

  const contractsPath = path.resolve(process.cwd(), "lib", "contracts.ts");
  const contents = `export const CONTRACTS = {
  arbitrumSepolia: {
    chainId: 421614,
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    mockUsdc: "${mockUsdcAddress}",
    escrow: "${escrowAddress}",
    host: "${deployer.address}"
  }
} as const;
`;

  fs.writeFileSync(contractsPath, contents, "utf8");
  console.log("Saved addresses to", contractsPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
