import { ConnectWallet } from "./components/ConnectWallet.component";
import { useGContext } from "./GContext";
import twitterLogo from "./assets/twitter-logo.svg";
import { useEffect } from "react";
import { MintDomainForm } from "./components/MintDomainForm.component";

// Constants
const TWITTER_HANDLE = "changisadev";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {
  const { walletAddress, setWalletAddress } = useGContext();

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
      setWalletAddress(ethereum.selectedAddress || null);
    }
  }, [setWalletAddress]);

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
          <MintDomainForm />
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
