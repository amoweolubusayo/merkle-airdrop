import { abi } from "./AirdropContract.json";
import { providers, Contract, ethers } from "ethers";
const { MerkleTree } = require("merkletreejs");

require("dotenv").config();

export async function getContract() {
  console.log("hey");
  const contractAddress = "0x4004aD23277E51E1086beba0C0E8644Cb0DAe1d5";
  const contractABI = abi;
  let supportTokenContract;
  try {
    const { ethereum } = window;
    console.log(ethereum.chainId);
    if (ethereum.chainId === "0xaef3") {
      const provider = new providers.Web3Provider(ethereum);
      console.log("provider", provider);
      const signer = provider.getSigner();
      supportTokenContract = new Contract(contractAddress, contractABI, signer);
    } else {
      throw new Error("Please connect to the Alfajores network");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  console.log(supportTokenContract);
  return supportTokenContract;
}

export async function claimTokens(proof, amount) {
  const contract = await getContract();
  const tx = await contract.claimTokens(proof, amount, {
    gasLimit: 300000,
  });
  await tx.wait();
  console.log(await tx);
}

export async function checkEligibility(whitelist) {
  const leaves = whitelist.map((address) => ethers.utils.keccak256(address));
  console.log("whielist", whitelist);
  console.log("leaves", leaves);
  const tree = new MerkleTree(leaves, ethers.utils.keccak256);

  const leaf = ethers.utils.keccak256(whitelist[0]);
  console.log("leaf", leaf);
  const proof = tree.getProof(leaf);
  const root = tree.getRoot().toString("hex");
  return tree.verify(proof, leaf, root);
}

export async function merkleRoot() {
  const merkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test"));
  return merkleRoot;
}

export async function getTheProof(whitelist) {
  const leaves = whitelist.map((address) => ethers.utils.keccak256(address));
  console.log("whielist", whitelist);
  console.log("leaves", leaves);
  const tree = new MerkleTree(leaves, ethers.utils.keccak256);

  const leaf = ethers.utils.keccak256(whitelist[0]);
  console.log("leaf", leaf);
  const proof = tree.getProof(leaf);
  const root = tree.getRoot().toString("hex");
  console.log(tree.verify(proof, leaf, root));
  console.log(proof);
  const bytes32Array = [];
  const buffer = proof[0].data;
  for (let i = 0; i < buffer.length; i += 32) {
    const slice = buffer.slice(i, i + 32);
    const bytes32 = `0x${slice.toString("hex").padEnd(64, "0")}`;
    bytes32Array.push(bytes32);
  }

  // Call the claimTokens function with a valid proof and an amount

  console.log(bytes32Array);
  return bytes32Array;
}
