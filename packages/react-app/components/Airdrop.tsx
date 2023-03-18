import React, { useState } from "react";
import {
  checkEligibility,
  claimTokens,
  getTheProof,
} from "../../../AirdropWrapper";
import { useAccount } from "wagmi";

const Airdrop = () => {
  const [isAddress, setAddress] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  let whitelist: any = [];
  // Convert the address to lowercase to make the search case-insensitive
  const lowercaseAddress = address?.toLowerCase;
  whitelist.push(lowercaseAddress);
  whitelist.push("0xe304cC7Cfed9120ADa3Cd04cC13e210F7c5F37ED");
  console.log(`${lowercaseAddress} added to whitelist and eligible`);

  const proof = getTheProof(whitelist);
  const checkEligibile = async () => {
    const isEligible = await checkEligibility(whitelist);
    console.log("is eligible", isEligible);
    setIsEligible(isEligible);
  };
  const claimAirdrop = async () => {
    const claim = await claimTokens(await proof, "1");
    console.log("claimed", claim);
    setIsClaimed(true);
  };

  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Airdrop</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={address}
        className="bg-white rounded-md py-2 px-4 mb-4 w-full"
      />
      <button
        onClick={checkEligibile}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Check eligibility
      </button>
      {isEligible && !isClaimed && (
        <div className="bg-green-100 p-4 rounded mt-4">
          <p className="text-green-700 font-bold mb-2">
            You are eligible for the airdrop!
          </p>
          <button
            onClick={claimAirdrop}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Claim airdrop
          </button>
        </div>
      )}
      {isEligible && isClaimed && (
        <p className="text-gray-700 font-bold mt-4">
          You have already claimed the airdrop.
        </p>
      )}
      {!isEligible && (
        <p className="text-red-700 font-bold mt-4">
          You are not eligible for the airdrop.
        </p>
      )}
    </div>
  );
};

export default Airdrop;
