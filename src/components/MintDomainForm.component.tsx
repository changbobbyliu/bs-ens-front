import { ethers } from "ethers";
import { useState } from "react";
import { C } from "../config/constants";
import { useGContext } from "../GContext";
import { useFetchMints } from "../hooks/contract/useFetchMints";

export const MintDomainForm = () => {
  const { mints, walletAddress, setModalData } = useGContext();
  const { fetchMints } = useFetchMints();

  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const mintDomain = async () => {
    if (!domain || !record || domain.length < 3) {
      alert("Please enter a domain at least 3 chars long and a record");
      return;
    }
    const price =
      domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);

    setLoading(true);

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

        setTimeout(() => {
          fetchMints();
          setLoading(false);
          setModalData({
            description: `Domain minted: ${domain}.${C.tld}`,
          });
        }, 2000);

        setRecord("");
        setDomain("");
      } else {
        alert("Transaction failed! Please try again");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const updateDomain = async () => {
    if (!record || !domain) {
      return;
    }
    setLoading(true);
    console.log("Updating domain", domain, "with record", record);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          C.CONTRACT_ADDRESS,
          C.CONTRACT_ABI.abi,
          signer
        );

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

        fetchMints();
        setRecord("");
        setDomain("");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const renderMints = () => {
    if (mints.length > 0) {
      return (
        <div className="my-4">
          <p className="text-center my-2 font-mono uppercase">
            Recently minted domains!
          </p>
          <div className="grid grid-cols-2 gap-2">
            {mints.map((mint, index) => {
              return (
                <div className="p-2 rounded-sm bg-slate-400" key={index}>
                  <div className="flex justify-between items-center">
                    <a
                      href={`https://testnets.opensea.io/assets/mumbai/${C.CONTRACT_ADDRESS}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="underline">{`${mint.name}.${C.tld}`}</p>
                    </a>
                    {/* If mint.owner is currentAccount, add an "edit" button*/}
                    {mint.owner.toLowerCase() ===
                    walletAddress?.toLowerCase() ? (
                      <button
                        className="w-4 h-4 opacity-80"
                        onClick={() => editRecord(mint.name)}
                      >
                        <img
                          src="https://img.icons8.com/metro/26/000000/pencil.png"
                          alt="Edit button"
                        />
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-2">{mint.record}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const editRecord = (name: string) => {
    console.log("Editing record for", name);
    setEditing(true);
    setDomain(name);
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

      <div className="flex justify-end">
        {editing ? (
          <>
            <button
              onClick={updateDomain}
              className="bg-amber-500 text-white px-4 py-2 rounded mt-4 block"
            >
              Set Record
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2 block"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="bg-amber-500 text-white px-4 py-2 rounded mt-4 block"
            disabled={false}
            onClick={mintDomain}
          >
            Mint
          </button>
        )}
      </div>
      {renderMints()}
    </div>
  );
};
