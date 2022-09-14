import {
  useState,
  createContext,
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type TModalData = { title?: string; description?: string };

type TGContext = {
  walletAddress: string | null;
  setWalletAddress: Dispatch<SetStateAction<string | null>>;
  network: string | null;
  setNetwork: Dispatch<SetStateAction<string | null>>;
  mints: DTO.TMint[];
  setMints: Dispatch<SetStateAction<DTO.TMint[]>>;
  modalData: TModalData | null;
  setModalData: Dispatch<SetStateAction<TModalData | null>>;
};

const GContext = createContext<TGContext>(undefined!);

export const GProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [mints, setMints] = useState<DTO.TMint[]>([]);
  const [modalData, setModalData] = useState<TModalData | null>(null);

  return (
    <GContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        network,
        setNetwork,
        mints,
        setMints,
        modalData,
        setModalData,
      }}
    >
      {children}
    </GContext.Provider>
  );
};

export const useGContext = () => useContext(GContext);
