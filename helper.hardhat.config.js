const { ethers } = require("hardhat");

const networkConfig = {
  31337: {
    name: "hardhat",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callBackGasLimit: "500000",
    mintFee: ethers.utils.parseEther("0.01"),
    AggregatorAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  11155111: {
    name: "sepolia",
    vrfCoordinatorAddress: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    subscriptionId: "1903",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callBackGasLimit: "500000",
    mintFee: ethers.utils.parseEther("0.01"),
    AggregatorAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const BASEFEE = "250000000000000000"; // 0.25 is this the premium in LINK?
const GASPRICELINK = 1e9;
const FUND_AMOUNT = ethers.utils.parseEther("30");

const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";

module.exports = {
  BASEFEE,
  GASPRICELINK,
  networkConfig,
  DECIMALS,
  INITIAL_PRICE,
};
