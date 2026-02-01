export const CONTRACTS = {
  arbitrumSepolia: {
    chainId: 421614,
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    mockUsdc: "0x6C66Be609d422B892d94B6d813dae30225E562ae",
    escrow: "0xe3ADf1248C3dA06A74D4cbfdADAdA6e9CC6B735E",
    host: "0x2BAfdce15E21Cd5875CF589a333712DE8454a469"
  }
,
  baseSepolia: {
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    mockUsdc: "0xff6f423cFDd53E88eb60a0E6BF5c6D2F90e5D9c5",
    escrow: "0xCf518966D025C1c49b9942044DE09f50CCeF9B2b",
    host: "0x2BAfdce15E21Cd5875CF589a333712DE8454a469"
  }
} as const;
