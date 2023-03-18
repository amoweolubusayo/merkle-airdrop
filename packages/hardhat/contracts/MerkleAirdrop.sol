pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MerkleAirdrop {
    // The Merkle root
    bytes32 public merkleRoot;
    
    // The token contract
    IERC20 public tokenContract;
    
    // Mapping to keep track of who claimed their tokens
    mapping(address => bool) public claimed;
    
    constructor(bytes32 _merkleRoot, address _tokenContractAddress) {
        merkleRoot = _merkleRoot;
        tokenContract = IERC20(_tokenContractAddress);
    }
    
    // Function to claim tokens by providing a merkle proof
    function claimTokens(bytes32[] calldata _proof, uint256 _amount) external {
        require(!claimed[msg.sender], "Tokens already claimed");
        require(verifyProof(_proof, msg.sender), "Invalid proof");
        
        // Mark the address as claimed
        claimed[msg.sender] = true;
        
        // Transfer tokens to the address
        tokenContract.transfer(msg.sender, _amount);
    }
    
    // Function to verify the merkle proof
    function verifyProof(bytes32[] calldata _proof, address _address) public view returns (bool) {
        // Compute the leaf hash
        bytes32 leaf = keccak256(abi.encodePacked(_address, msg.sender));
        
        // Compute the root hash
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < _proof.length; i++) {
            bytes32 proofElement = _proof[i];
            
            if (computedHash < proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        
        // Check if the computed hash matches the Merkle root
        return computedHash == merkleRoot;
    }
}
