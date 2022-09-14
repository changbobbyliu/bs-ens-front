import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { C } from "../../config/constants";
import { useGContext } from "../../GContext";

const fetchMints = async (setMints: any) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // You know all this
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        C.CONTRACT_ADDRESS,
        C.CONTRACT_ABI.abi,
        signer
      );

      // Get all the domain names from our contract
      const names: string[] = await contract.getAllNames();

      // For each name, get the record and the address
      const mintRecords = await Promise.all(
        names.map(async (name) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        })
      );

      console.log("MINTS FETCHED ", mintRecords);
      setMints(mintRecords);
    }
  } catch (error) {
    console.log(error);
  }
};

export const useFetchMints = () => {
  const { setMints } = useGContext();
  const [loading, setLoading] = useState(false);

  return {
    loading,
    fetchMints: useCallback(async () => {
      setLoading(true);
      await fetchMints(setMints);
      setLoading(false);
    }, []),
  };
};
