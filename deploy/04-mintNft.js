const { ethers, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;

  // Minting Basic NFT
  const basicNft = await ethers.getContract("BasicNft", deployer);
  const basicNFTMintTx = await basicNft.mintNFT();
  await basicNFTMintTx.wait(1);
  console.log(
    `Basic NFT Index 0 Minted , The tokenURI is ${await basicNft.tokenURI(0)}`
  );

  // Minting Dynamic SVG NFT
  const dynamicNft = await ethers.getContract("DynamicSvgNft", deployer);
  const highValue = ethers.utils.parseEther("4000");
  const nftMintTx = await dynamicNft.mintNft(highValue);
  await nftMintTx.wait(1);
  console.log(
    `Dynamic Nft Minted with the token URI ${await dynamicNft.tokenURI(0)}`
  );

  // Minting Random IPFS NFT
  const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomIpfsNft.getMintFee();
  const randomNftMintTx = await randomIpfsNft.requestNFT({ value: mintFee });
  const randomNftMintTxReceipt = await randomNftMintTx.wait(1);

  await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000);

    randomIpfsNft.once("nftMinted", async () => {
      console.log(
        `Random IPFS Nft minted with token URI ${await randomIpfsNft.tokenURI(
          0
        )}`
      );
      resolve();
    });

    if (chainId == 31337) {
      const requestId =
        await randomNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorMock = await ethers.getContract(
        "VRFCoordinatorV2Mock",
        deployer
      );
      await vrfCoordinatorMock.fulfillRandomWords(
        requestId,
        randomIpfsNft.address
      );
    }
  });
};

module.exports.tags = ["all", "mint"];
