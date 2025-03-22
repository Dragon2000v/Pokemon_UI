import { FC, ReactNode, createContext, useContext, useState } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { authenticate } from "@/features/auth/api/auth";

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  isConnecting: false,
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
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsConnecting(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await authenticate(signer);
        setProvider(provider);
        setSigner(signer);
      } catch (error) {
        console.error("Error connecting to Web3:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      window.open("https://metamask.io", "_blank");
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    localStorage.removeItem("token");
  };

  return (
    <Web3Context.Provider
      value={{ provider, signer, isConnecting, connect, disconnect }}
    >
      {children}
    </Web3Context.Provider>
  );
};
