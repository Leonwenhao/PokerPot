const { ethers } = require("hardhat");

async function main() {
  const mockUsdc = await ethers.getContractAt("MockUSDC", "0x6C66Be609d422B892d94B6d813dae30225E562ae");
  const amount = ethers.utils.parseUnits("10000", 6);
  const target = "0x2BAfdce15E21Cd5875CF589a333712DE8454a469";
  console.log("Minting 10000 MockUSDC on Arbitrum Sepolia to:", target);
  const tx = await mockUsdc.mint(target, amount);
  await tx.wait();
  console.log("Done");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
