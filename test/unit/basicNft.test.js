const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");

const chainId = network.config.chainId;

chainId == 31337
  ? describe("Basic NFTs", () => {
      let basicNft, deployer;
      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["basicNft"]);
        basicNft = await ethers.getContract("BasicNft");
      });

      describe("Constructor", () => {
        it("it initialises the value properly!", async () => {
          const name = await basicNft.name();
          const symbol = await basicNft.symbol();
          const tokenId = await basicNft.getTokenCounter();
          assert.equal(name, "Basic NFT");
          assert.equal(symbol, "animo");
          assert.equal(tokenId, "0");
        });
      });

      describe("mintNft", () => {
        beforeEach(async () => {
          const tx = await basicNft.mintNFT();
          await tx.wait(1);
        });

        it("It should mint the Nft and provide Image URI", async () => {
          const tokenUri = await basicNft.tokenURI(0);
          const tokenCounter = await basicNft.getTokenCounter();
          assert.equal(tokenCounter, "1");
          assert.equal(tokenUri, await basicNft.getTokenURI());
        });

        it("It should give the owner and address of owner properly!", async () => {
          const owner = await basicNft.ownerOf(0);
          const balance = await basicNft.balanceOf(deployer.address);
          assert.equal(owner, deployer.address);
          assert.equal(balance.toString(), "1");
        });
      });
    })
  : describe.skip;
