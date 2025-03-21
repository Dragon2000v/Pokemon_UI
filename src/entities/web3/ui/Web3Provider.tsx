import { FC, ReactNode, createContext, useContext, useState } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

interface Props {
  children: ReactNode;
}

export const Web3Provider: FC<Props> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
      } catch (error) {
        console.error("Error connecting to Web3:", error);
      }
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
  };

  return (
    <Web3Context.Provider value={{ provider, signer, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};
