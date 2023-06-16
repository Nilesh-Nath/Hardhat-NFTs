const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper.hardhat.config");
const fs = require("fs");
require("dotenv").config();
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;

  const lowImage = fs.readFileSync("./images/dynamicSvgNft/frown.svg", "utf-8");
  const highImage = fs.readFileSync(
    "./images/dynamicSvgNft/happy.svg",
    "utf-8"
  );

  let AggregatorV3Address;
  if (chainId == 31331) {
    const MockV3Aggregator = await deployments.get("MockV3Aggregator");
    AggregatorV3Address = MockV3Aggregator.address;
  } else {
    AggregatorV3Address = networkConfig[chainId]["AggregatorAddress"];
  }

  const args = [AggregatorV3Address, lowImage, highImage];
  console.log("============================================================");
  console.log("Deploying Dynamic SVG NFTs");

  const dynamicSvgNft = await deploy("DynamicSvgNft", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations,
  });
  console.log("Dynamic SVG NFTs Deployed !!!!");
  console.log("============================================================");
  console.log("Verifying....");
  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(dynamicSvgNft.address, args);
  }
  console.log("============================================================");
};

module.exports.tags = ["all", "dynamicNft","main"];
