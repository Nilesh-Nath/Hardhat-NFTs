require("hardhat-gas-reporter");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },

  namedAccounts: {
    deployer: {
      31337: 0,
      11155111: 0,
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    enabled: true,
    noColors: true,
    outputFile: "gasReport.txt",
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 500000,
  },
};
