//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Errors
error RandomIpfsNft__RangeOutOfBound();
error RandomIpfsNft__TransferFailed();
error RandomIpfsNft__NotEnoughEthPaid();

contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    // Enum
    enum Breed {
        cuteMushroom,
        scaryAlien,
        scaryMonkey
    }

    // ChainLink VRF variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 4;
    uint32 private constant NUM_WORDS = 1;

    // NFT variables
    mapping(uint256 => address) private s_requestIdToSender;
    uint256 private s_tokenCounter;
    uint256 private MAX_CHANCE_VALUE = 100;
    string[] internal s_ntfBreedURI;
    uint256 private immutable i_mintFee;

    // Events
    event nftRequested(uint256 indexed requestId, address requester);
    event nftMinted(Breed nftBreed, address minter);

    constructor(
        address vrfCoordinatorAddress,
        bytes32 keyHash,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        string[3] memory nftBreedURI,
        uint256 mintFee
    ) ERC721("RandomIpfsNft", "RIN") VRFConsumerBaseV2(vrfCoordinatorAddress) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorAddress);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_tokenCounter = 0;
        s_ntfBreedURI = nftBreedURI;
        i_mintFee = mintFee;
    }

    function requestNFT() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NotEnoughEthPaid();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;
        emit nftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address minter = s_requestIdToSender[requestId];
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed nftBreed = getNftFromModdedRng(moddedRng);
        _safeMint(minter, s_tokenCounter);
        _setTokenURI(s_tokenCounter, s_ntfBreedURI[uint256(nftBreed)]);
        s_tokenCounter = s_tokenCounter + 1;
        emit nftMinted(nftBreed, minter);
    }

    function getChanceArray() public view returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getNftFromModdedRng(
        uint256 moddedRng
    ) public view returns (Breed) {
        uint256 cummulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            // 25
            if (moddedRng >= cummulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }
            cummulativeSum = cummulativeSum + chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBound();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    // Getters

    function getSubscriptionId() public view returns (uint256) {
        return i_subscriptionId;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getTokenUri(uint256 index) public view returns (string memory) {
        return s_ntfBreedURI[index];
    }
}
