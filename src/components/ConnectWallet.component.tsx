import { useGContext } from "../GContext";

export const ConnectWallet = () => {
  const { walletAddress, setWalletAddress } = useGContext();

  const connectWallet = async () => {
    try {
      console.log(window.ethereum);
      // const [address] = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      // setWalletAddress(address);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
      <p className="mt-4">{`Wallet: ${walletAddress}`}</p>
    </div>
  );
};
