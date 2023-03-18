const hre = require("hardhat");

async function main() {
  const merkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test"));
  const tokenContractAddress = '0xB3C20f3011ac4f713b3E6252E9B6A2060EB912a1'; // Replace with your token contract address
  const MerkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop");
  const merkleAirdrop = await MerkleAirdrop.deploy(merkleRoot,tokenContractAddress);
  await merkleAirdrop.deployed();
  console.log("MerkleAirdrop address deployed to:", merkleAirdrop.address);
}

main();
