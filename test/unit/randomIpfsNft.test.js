const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const chainId = network.config.chainId;
const { networkConfig } = require("../../helper.hardhat.config");
chainId == 31337
  ? describe("RandomIPFS NFTs", () => {
      let randomIpfsNft, deployer, vrfCoordinatorV2Mock;
      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["randomipfs", "mocks"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
      });

      describe("Constructor", async () => {
        it("It initializes the value of RandomNFT's Costructor Properly!", async () => {
          const mintFee = networkConfig[chainId]["mintFee"];
          const mintFeeFromContract = await randomIpfsNft.getMintFee();
          const tokenCounter = await randomIpfsNft.getTokenCounter();
          assert.equal(mintFee.toString(), mintFeeFromContract.toString());
          assert.equal(tokenCounter.toString(), "0");
        });
      });

      describe("RequestNFT", () => {
        let mintFee;
        beforeEach(async () => {
          mintFee = await randomIpfsNft.getMintFee();
        });

        it("It should revert with an error if not paid enough ETH!", async () => {
          await expect(randomIpfsNft.requestNFT()).to.be.revertedWith(
            "RandomIpfsNft__NotEnoughEthPaid"
          );
        });

        it("It should emit an event for NFT requested!", async () => {
          await expect(randomIpfsNft.requestNFT(mintFee)).to.emit(
            randomIpfsNft,
            "nftRequested"
          );
        });
      });

      describe("fulfillRandomWords", () => {
        it("It mints the NFT after the random number is returned!", async () => {
          await new Promise(async (resolve, reject) => {
            randomIpfsNft.once("nftMinted", async () => {
              try {
                const tokenCounter = await randomIpfsNft.getTokenCounter();
                assert.equal(tokenCounter.toString(), "1");
                resolve();
              } catch (error) {
                console.log(error);
                reject(error);
              }
              //   try {
              //     const randomipfsResponse = await randomIpfsNft.requestNFT({
              //       value: fee,
              //     });
              //     const randomipfsReceipt = await randomipfsResponse.wait(1);
              //     await vrfCoordinatorV2Mock.fulfillRandomWords(
              //       randomipfsReceipt.events[1].args.requestId,
              //       randomIpfsNft.address
              //     );
              //   } catch (error) {
              //     console.log(error);
              //     reject(error);
              //   }
            });
            const randomipfsResponse = await randomIpfsNft.requestNFT({
              value: fee,
            });
            const randomipfsReceipt = await randomipfsResponse.wait(1);
            await vrfCoordinatorV2Mock.fulfillRandomWords(
              randomipfsReceipt.events[1].args.requestId,
              randomIpfsNft.address
            );
          });
        });
      });

      describe("getNftFromModdedRng", () => {
        it("It should provide cuteMushroom if the moddedRng is less than 10!", async () => {
          const expectedValue = await randomIpfsNft.getNftFromModdedRng(8);
          assert.equal(expectedValue, 0);
        });

        it("It shoulf provide scaryAlien if the moddedRng is less than 30 and greater than 10!", async () => {
          const expectedValue = await randomIpfsNft.getNftFromModdedRng(24);
          assert.equal(expectedValue, 1);
        });

        it("It should provide scaryMonkey if the moddedRng is less than 100 and greater than 20!", async () => {
          const expectedValue = await randomIpfsNft.getNftFromModdedRng(88);
          assert.equal(expectedValue, 2);
        });

        it("It should revert if the moddedRng is greater than 100!", async () => {
          await expect(
            randomIpfsNft.getNftFromModdedRng(101)
          ).to.be.revertedWith("RandomIpfsNft__RangeOutOfBound");
        });
      });
    })
  : describe.skip;
