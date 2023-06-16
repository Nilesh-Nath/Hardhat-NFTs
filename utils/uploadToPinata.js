const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretKey = process.env.PINATA_API_KEY_SECRET;
const pinata = new pinataSDK(pinataApiKey, pinataSecretKey);

async function storeToPinata(imagePath) {
  const fullFilePath = path.resolve(imagePath);
  const files = fs
    .readdirSync(fullFilePath)
    .filter((file) => file.includes(".png"));
  const response = [];
  console.log("uploading To IPFS....");
  for (const fileIndex in files) {
    const readFileStream = fs.createReadStream(
      `${fullFilePath}/${files[fileIndex]}`
    );
    const option = {
      pinataMetadata: {
        name: files[fileIndex],
      },
    };

    try {
      await pinata
        .pinFileToIPFS(readFileStream, option)
        .then((result) => {
          response.push(result);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  return { response, files };
}

async function storeTokenUriMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  };
  try {
    const response = await pinata.pinJSONToIPFS(metadata, options);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}

module.exports = {
  storeToPinata,
  storeTokenUriMetadata,
};
