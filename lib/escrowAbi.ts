export const ESCROW_ABI = [
  { inputs: [{ internalType: "address", name: "usdcAddress", type: "address" }, { internalType: "address", name: "hostAddress", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "player", type: "address" }, { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }], name: "Deposit", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "player", type: "address" }, { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }], name: "Payout", type: "event" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "deposit", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "getGameBalance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "player", type: "address" }], name: "getPlayerBalance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "host", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "player", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "payout", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "usdc", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
] as const;
