const { ethers } = require("hardhat");

const TARGETS: Record<string, string> = {
  baseSepolia: "0xff6f423cFDd53E88eb60a0E6BF5c6D2F90e5D9c5",
  arbitrumSepolia: "0x6C66Be609d422B892d94B6d813dae30225E562ae",
};

async function main() {
  const network = await ethers.provider.getNetwork();
  const name = network.chainId === 84532 ? "baseSepolia" : "arbitrumSepolia";
  const mockUsdcAddr = TARGETS[name];
  if (!mockUsdcAddr) throw new Error("Unknown network");

  const recipient = "0xe0a1462782d51515276D90eF6b11007DB308a6d6";
  const amount = ethers.utils.parseUnits("10000", 6);
  const mockUsdc = await ethers.getContractAt("MockUSDC", mockUsdcAddr);

  console.log(`Minting 10000 MockUSDC on ${name} to ${recipient}`);
  const tx = await mockUsdc.mint(recipient, amount);
  await tx.wait();
  console.log("Done");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
