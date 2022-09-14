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
  mints: DTO.TMint[];
  setMints: Dispatch<SetStateAction<DTO.TMint[]>>;
};

const GContext = createContext<TGContext>(undefined!);

export const GProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [mints, setMints] = useState<DTO.TMint[]>([]);

  return (
    <GContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        network,
        setNetwork,
        mints,
        setMints,
      }}
    >
      {children}
    </GContext.Provider>
  );
};

export const useGContext = () => useContext(GContext);
