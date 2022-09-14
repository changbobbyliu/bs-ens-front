import {
  useState,
  createContext,
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type TGContext = {
  walletAddress: string | null;
  setWalletAddress: Dispatch<SetStateAction<string | null>>;
  network: string | null;
  setNetwork: Dispatch<SetStateAction<string | null>>;
};

const GContext = createContext<TGContext>(undefined!);

export const GProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  return (
    <GContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        network,
        setNetwork,
      }}
    >
      {children}
    </GContext.Provider>
  );
};

export const useGContext = () => useContext(GContext);
