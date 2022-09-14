import { ConnectWallet } from "./components/ConnectWallet.component";
import { useGContext } from "./GContext";
import twitterLogo from "./assets/twitter-logo.svg";
import { useEffect } from "react";
import { MintDomainForm } from "./components/MintDomainForm.component";
import { C } from "./config/constants";
import { useFetchMints } from "./hooks/contract/useFetchMints";

// Constants
const TWITTER_HANDLE = "changisadev";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {
  const { walletAddress, setWalletAddress, network, setNetwork, mints } =
    useGContext();

  const { fetchMints } = useFetchMints();

  useEffect(() => {
    if (window.ethereum) {
      console.log("1. ethereum.selectedAddress", ethereum.selectedAddress);
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log("accountsChanged", ethereum.selectedAddress, accounts);
        if (accounts.length > 0 && ethereum.selectedAddress) {
          setWalletAddress(ethereum.selectedAddress);
        } else {
          setWalletAddress(null);
        }
      });
      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          console.log("eth_accounts", ethereum.selectedAddress, accounts);
          const account =
            ethereum.selectedAddress ||
            (accounts.length > 0 ? accounts[0] : null);

          setWalletAddress(account);
        });

      ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
        setNetwork(C.networks[chainId]);
      });
      ethereum.on("chainChanged", (chainId: string) => {
        setNetwork(C.networks[chainId]);
      });
    }
  }, []);

  useEffect(() => {
    if (walletAddress && network === "Polygon Mumbai Testnet") {
      fetchMints();
    }
  }, [network, walletAddress]);

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }], // Check networks.js for hexadecimal network ids
        });
      } catch (error: any) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  chainName: "Polygon Mumbai Testnet",
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <header className="flex items-center px-4 justify-between h-16">
        <div className="text-xl font-bold">📣 FETH</div>
        <ConnectWallet />
      </header>
      <main className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl">📍 Fake ETH Name Service</h1>
        <p>This seems like an ENS project clone!</p>
        <div className="mx-auto my-4 max-w-[22rem]">
          <img
            src="https://media.giphy.com/media/MagSgolK3ScWvtHAB4/giphy.gif"
            alt=""
          />
        </div>
        {!!window.ethereum && walletAddress ? (
          network === "Polygon Mumbai Testnet" ? (
            <MintDomainForm />
          ) : (
            <p className="text-amber-400 m-2 font-mono text-center">
              Please{" "}
              <button
                className="underline underline-offset-4"
                onClick={switchNetwork}
              >
                switch
              </button>{" "}
              to Polygon Mumbai Testnet
            </p>
          )
        ) : (
          <p className="text-amber-400 m-2 font-mono text-center">
            Please install a wallet and connect first
          </p>
        )}
      </main>
      <footer className="h-16 flex items-center justify-center">
        <img alt="Twitter Logo" className="w-12" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >
          {`built with @${TWITTER_HANDLE}`}
        </a>
      </footer>
    </div>
  );
}

export default App;
