import { FC, ReactNode, createContext, useContext, useState } from "react";
import { providers } from "ethers";
import { authenticate } from "@/features/auth/api/auth";

interface Web3ContextType {
  provider: providers.Web3Provider | null;
  signer: providers.JsonRpcSigner | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

interface Props {
  children: ReactNode;
}

export const Web3Provider: FC<Props> = ({ children }) => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsConnecting(true);
        setError(null);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        await authenticate(signer);
        setProvider(provider);
        setSigner(signer);
      } catch (error) {
        console.error("Error connecting to Web3:", error);
        setError(
          error instanceof Error ? error.message : "Failed to connect wallet"
        );
        setProvider(null);
        setSigner(null);
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
    setError(null);
    localStorage.removeItem("token");
  };

  return (
    <Web3Context.Provider
      value={{ provider, signer, isConnecting, error, connect, disconnect }}
    >
      {children}
    </Web3Context.Provider>
  );
};
