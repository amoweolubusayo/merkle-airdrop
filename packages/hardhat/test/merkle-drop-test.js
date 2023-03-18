// Import the required dependencies and the smart contract
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");

describe("MerkleAirdrop", function () {
  // Define some variables to use in the tests
  let merkleRoot;
  let airdrop;
  let token;
  let owner;
  let amount = ethers.utils.parseEther("100");

  // Create the Merkle Airdrop contract and token contract before each test
  beforeEach(async function () {
    [owner, recipient1, recipient2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(amount);
    const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
    merkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test"));
    console.log("merkleroot", merkleRoot);
    airdrop = await MerkleAirdrop.deploy(merkleRoot, token.address);
    await token.transfer(airdrop.address, ethers.utils.parseEther("10"));
  });

  // Test that the contract deploys successfully
  describe("Deployment", function () {
    it("Should deploy MerkleAirdrop and Token contracts successfully", async function () {
      expect(airdrop.address).to.not.equal(ethers.constants.AddressZero);
      expect(token.address).to.not.equal(ethers.constants.AddressZero);
    });
  });

  // Test that only eligible recipients can claim tokens
  describe("Claiming tokens", function () {
    it("Should allow eligible recipients to claim their tokens and check for invalid proof", async function () {
      // Generate a proof

      const whitelist = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0xe304cC7Cfed9120ADa3Cd04cC13e210F7c5F37ED",
      ]; // Replace with real whitelist
      const leaves = whitelist.map((address) =>
        ethers.utils.keccak256(address)
      );
      console.log("leaves", leaves);
      const tree = new MerkleTree(leaves);
      const leaf = ethers.utils.keccak256(
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
      );
      console.log(leaf);
      const proof = tree.getProof(leaf);

      // Call the claimTokens function with a valid proof and an amount
      const buffer = proof[0].data;
      const bytes32Array = [];
      for (let i = 0; i < buffer.length; i += 32) {
        const slice = buffer.slice(i, i + 32);
        const bytes32 = `0x${slice.toString("hex").padEnd(64, "0")}`;
        bytes32Array.push(bytes32);
      }
      const result = await airdrop.claimTokens(bytes32Array, 3, {
        gasLimit: 500000,
      });
      expect(result)
        .to.emit(airdrop, "Tokens already claimed")
        .withArgs(bytes32Array);

      const invalidProof = tree.getProof(
        ethers.utils.keccak256("0x70997970C51812dc3A010C7d01b50e0e17dc79C9")
      );
      expect(invalidProof)
        .to.emit(airdrop, "Invalid Proof")
        .withArgs(invalidProof);
    });
    it("Should be able to verify proof", async function () {
      const whitelist = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0xe304cC7Cfed9120ADa3Cd04cC13e210F7c5F37ED",
      ]; // Replace with real whitelist
      const leaves = whitelist.map((address) =>
        ethers.utils.keccak256(address)
      );
      const tree = new MerkleTree(leaves);
      const leaf = ethers.utils.keccak256(
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
      );
      const proof = tree.getProof(leaf);
      // Call the claimTokens function with a valid proof and an amount
      const buffer = proof[0].data;
      const bytes32Array = [];
      for (let i = 0; i < buffer.length; i += 32) {
        const slice = buffer.slice(i, i + 32);
        const bytes32 = `0x${slice.toString("hex").padEnd(64, "0")}`;
        bytes32Array.push(bytes32);
      }
      const res = await airdrop.verifyProof(
        bytes32Array,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        { gasLimit: 500000 }
      );
      expect(res)
        .to.emit(airdrop, true)
        .withArgs("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    });
  });
});
