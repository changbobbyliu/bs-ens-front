import { useMemo } from "react";
import { useGContext } from "../GContext";
import polygonLogo from "../assets/polygonlogo.png";
import ethLogo from "../assets/ethlogo.png";

type TWalletCTA = {
  title: string;
  onClick?: () => void;
};

const shortAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ConnectWallet = () => {
  const { walletAddress, network } = useGContext();

  const action = useMemo<TWalletCTA>(() => {
    if (!window.ethereum) {
      return {
        title: "Install Metamask",
        onClick: () => {
          window.open("https://metamask.io/download.html", "_blank");
        },
      };
    }

    if (!walletAddress) {
      return {
        title: "Connect Wallet",
        onClick: () => {
          // Check if have access
          // const accounts = await ethereum.request({ method: 'eth_accounts' });
          ethereum.request({ method: "eth_requestAccounts" }); // set accountsChanged listener in App.tsx
        },
      };
    }

    return {
      title: shortAddress(walletAddress),
    };
  }, [walletAddress]);

  return (
    <div className="flex">
      <button
        className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={action.onClick}
      >
        {!!network && !!walletAddress && (
          <img
            alt="Network logo"
            className="w-4 h-4 mr-1.5"
            src={network?.includes("Polygon") ? polygonLogo : ethLogo}
          />
        )}

        {action.title}
      </button>
    </div>
  );
};
