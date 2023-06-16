const { network, ethers } = require("hardhat");
const { networkConfig } = require("../helper.hardhat.config");
const { verify } = require("../utils/verify");

const {
  storeToPinata,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");
const imagesLocation = "./images/randomIpfsNft/";
require("dotenv").config();

let nftBreedURI = [
  "ipfs://QmRvCpvgMrgYMZinYgsiR1vjYQEDGBZ966VdWMsv4cjqtK",
  "ipfs://QmZfdYZC6GGE6wbnkGugfDGHPdGMeAaSzngWF8qQFNe34q",
  "ipfs://QmdfkaZbxD5P7kKFU8915khodMNgBFgXZmWMKdSfNutNCp",
];

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "scary",
      value: 100,
    },
  ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;

  const FUND_AMOUNT = ethers.utils.parseEther("30");
  let VRFCoordinatorV2MockAddress, subscriptionId;

  if (process.env.uploadToPinata == "true") {
    tokenUris = await handleTokenUris();
  }
  if (chainId == 31337) {
    const VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    VRFCoordinatorV2MockAddress = VRFCoordinatorV2Mock.address;
    const txResponse = await VRFCoordinatorV2Mock.createSubscription();
    const txReceipt = await txResponse.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    VRFCoordinatorV2MockAddress =
      networkConfig[chainId]["vrfCoordinatorAddress"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const keyHash = networkConfig[chainId]["keyHash"];
  const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"];
  const mintFee = networkConfig[chainId]["mintFee"];

  const args = [
    VRFCoordinatorV2MockAddress,
    keyHash,
    subscriptionId,
    callBackGasLimit,
    nftBreedURI,
    mintFee,
  ];

  console.log("============================================================");
  console.log("Deploying RandomIpfsNft....");
  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations,
  });
  console.log("RandomIpfsNft Deployed!");
  console.log("============================================================");
  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(randomIpfsNft.address, args);
    console.log("============================================================");
  }
};

async function handleTokenUris() {
  tokenUris = [];
  const { responses: imageUploadResponses, files } = await storeToPinata(
    imagesLocation
  );
  for (const imageUploadResponseIndex in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
    tokenUriMetadata.description = `Scary ${tokenUriMetadata.name} !`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log("Token URIs uploaded! They are:");
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
