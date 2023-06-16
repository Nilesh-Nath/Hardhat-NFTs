# NFT Minting Project

This project aims to provide functionality for minting different types of NFTs. The supported NFT types include basic NFTs, random IPFS NFTs, and dynamic SVG NFTs. The project is developed using the Hardhat development environment.

## Table of Contents

- [Installation](#installation)
- [Basic NFTs](#basic-nfts)
- [Random IPFS NFTs](#random-ipfs-nfts)
- [Dynamic SVG NFTs](#dynamic-svg-nfts)
- [Testing](#testing)

## Installation

To install and set up the project locally, please follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Nilesh-Nath/Hardhat-NFTs.git
```

3. Configure the development environment, such as network settings and provider URLs, in the `.env` file.

## Basic NFTs

The basic NFTs in this project utilize the OpenZeppelin contract ERC721 for minting and tokenURI management. The tokenURI is hardcoded within the contract code. To deploy the basic NFTs, follow these steps:

1. Deploy the contracts:

```bash
yarn hardhat deploy
```

2. Customize the tokenURI within the contract code as needed.

3. Mint NFTs by interacting with the deployed contract.

## Random IPFS NFTs

The random IPFS NFTs utilize the InterPlanetary File System (IPFS) for storing the NFTs and their metadata. The randomness for minting is obtained using Chainlink VRF (Verifiable Random Function). Pinata is used for pining our IPFS files , so that there will be atleast one node other than our pinning our nfts. To mint random IPFS NFTs, perform the following steps:

1. Ensure the Chainlink VRF and Pinata configurations are correctly set in the `.env` file.

2. Here `getChanceArray` function is used to set the rarity of the NFTs.

3. `fulfillRandomWord` and `getNftFromModdedRng` function mint a random NFT based on the obtained random number and the rarity of the NFT.

## Dynamic SVG NFTs

The dynamic SVG NFTs are stored entirely on-chain and are more gas expensive compared to the other NFT types. The current price feed is obtained using Chainlink PriceFeed. The minting of either the "happy.svg" or "frown.svg" NFT depends on the comparison of the current price with a highPrice value set for the NFT. To mint dynamic SVG NFTs, follow these steps:

1. Ensure the Chainlink PriceFeed configuration is correctly set in the `.env` file.

2. Set the `highPrice` value for the NFT.

3. Execute the minting function, which will determine whether to mint the "happy.svg" or "frown.svg" NFT based on the current price.

## Testing

This project includes testing functionality to ensure the correctness of the implemented functionalities. To run the tests, use the following command:

```bash
yarn hardhat test
```

Make sure to review and adjust the test cases as needed before running them.

Feel free to reach out for any further questions or clarifications. Happy minting!
