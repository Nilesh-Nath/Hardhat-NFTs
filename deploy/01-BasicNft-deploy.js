const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  const args = [];

  log("------------------------------------------------------------");
  log("Deploying Basic NFT ....");
  const basicNft = await deploy("BasicNft", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations,
  });
  log("Basic NFT deployed!");
  log("------------------------------------------------------------");

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("Verifying....");
    await verify(basicNft.address, args);
    log("Verified!");
    log("------------------------------------------------------------");
  }
};

module.exports.tags = ["basicNft", "all", "main"];
