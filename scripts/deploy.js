const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  

  const CardMarketPlace = await hre.ethers.getContractFactory("CardMarketPlace");
  const cardMarketPlace = await CardMarketPlace.deploy();
  await cardMarketPlace.deployed();
  console.log("CardMarketPlace deployed to:", cardMarketPlace.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(cardMarketPlace.address);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
