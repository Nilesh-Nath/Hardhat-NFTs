const { network, ethers } = require("hardhat");
const {
  BASEFEE,
  GASPRICELINK,
  DECIMALS,
  INITIAL_PRICE,
} = require("../helper.hardhat.config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  const args = [BASEFEE, GASPRICELINK];
  const arguments = [DECIMALS, INITIAL_PRICE];

  if (chainId == 31337) {
    console.log("============================================================");
    console.log("Local Host Detected !!!! Deploying Mocks.....");
    console.log("VRFCoordinatorV2Mock Deploying....");
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: args,
    });
    console.log("Mocks Deployed !!!!");
    console.log("============================================================");
    console.log("MockV3Aggregator Deploying....");
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: arguments,
    });
    console.log("MockV3Aggregator Deployed !!!!");
    console.log("============================================================");
  }
};

module.exports.tags = ["all", "mocks", "main"];
