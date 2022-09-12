import { ConnectWallet } from "./components/ConnectWallet.component";
import { useGContext } from "./GContext";

function App() {
  const { walletAddress } = useGContext();

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <header className="App-header h-16">
        <ConnectWallet />
      </header>
      <main className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl">📍 Fake ETH Name Service</h1>
        <p>This seems like an ENS project clone!</p>
      </main>
    </div>
  );
}

export default App;
