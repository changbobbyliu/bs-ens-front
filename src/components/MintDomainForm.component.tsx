import { ethers } from "ethers";
import { useState } from "react";
import { C } from "../config/constants";

export const MintDomainForm = () => {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");

  const mintDomain = async () => {
    if (!domain || !record || domain.length < 3) {
      alert("Please enter a domain at least 3 chars long and a record");
      return;
    }
    const price =
      domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        C.CONTRACT_ADDRESS,
        C.CONTRACT_ABI.abi,
        signer
      );

      console.log("Going to pop wallet now to pay gas...");
      let tx = await contract.register(domain, {
        value: ethers.utils.parseEther(price),
      });
      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
        );

        // Set the record for the domain
        tx = await contract.setRecord(domain, record);
        await tx.wait();

        console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

        setRecord("");
        setDomain("");
      } else {
        alert("Transaction failed! Please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-w-[22rem]">
      <div className="relative flex items-center">
        <input
          type="text"
          value={domain}
          placeholder="domain"
          onChange={(e) => setDomain(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded w-full"
        />
        <p className="absolute right-2">{`.${C.tld}`}</p>
      </div>

      <input
        type="text"
        value={record}
        placeholder="what is this domain for?"
        onChange={(e) => setRecord(e.target.value)}
        className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
      />

      <div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-auto block"
          disabled={false}
          onClick={mintDomain}
        >
          Mint
        </button>
      </div>
    </div>
  );
};
