// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PokerPotEscrow {
    IERC20 public immutable usdc;
    address public immutable host;

    mapping(address => uint256) private balances;
    uint256 private totalPot;

    event Deposit(address indexed player, uint256 amount);
    event Payout(address indexed player, uint256 amount);

    modifier onlyHost() {
        require(msg.sender == host, "PokerPotEscrow: not host");
        _;
    }

    constructor(address usdcAddress, address hostAddress) {
        require(usdcAddress != address(0), "PokerPotEscrow: USDC is zero");
        require(hostAddress != address(0), "PokerPotEscrow: host is zero");
        usdc = IERC20(usdcAddress);
        host = hostAddress;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "PokerPotEscrow: amount is zero");
        bool ok = usdc.transferFrom(msg.sender, address(this), amount);
        require(ok, "PokerPotEscrow: transfer failed");
        balances[msg.sender] += amount;
        totalPot += amount;
        emit Deposit(msg.sender, amount);
    }

    function payout(address player, uint256 amount) external onlyHost {
        require(player != address(0), "PokerPotEscrow: player is zero");
        require(amount > 0, "PokerPotEscrow: amount is zero");
        require(totalPot >= amount, "PokerPotEscrow: insufficient pot");
        uint256 playerBalance = balances[player];
        balances[player] = playerBalance >= amount ? playerBalance - amount : 0;
        totalPot -= amount;
        bool ok = usdc.transfer(player, amount);
        require(ok, "PokerPotEscrow: transfer failed");
        emit Payout(player, amount);
    }

    function getGameBalance() external view returns (uint256) {
        return totalPot;
    }

    function getPlayerBalance(address player) external view returns (uint256) {
        return balances[player];
    }
}
