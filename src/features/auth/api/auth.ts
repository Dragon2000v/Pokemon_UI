import { api } from "@/shared/api";
import { JsonRpcSigner } from "ethers";

export const getNonce = async (walletAddress: string) => {
  console.log("Getting nonce for address:", walletAddress);
  const response = await api.post("/auth/nonce", { walletAddress });
  console.log("Nonce received:", response.data);
  return response.data.nonce;
};

export const verifySignature = async (
  walletAddress: string,
  signature: string
) => {
  console.log("Verifying signature:", { walletAddress, signature });
  const response = await api.post("/auth/verify", { walletAddress, signature });
  console.log("Verification response:", response.data);
  const { token } = response.data;
  console.log("Setting token in localStorage:", token);
  localStorage.setItem("token", token);
  return token;
};

export const authenticate = async (signer: JsonRpcSigner) => {
  try {
    console.log("Starting authentication process...");
    const walletAddress = await signer.getAddress();
    console.log("Wallet address:", walletAddress);

    const nonce = await getNonce(walletAddress);
    console.log("Got nonce:", nonce);

    const message = `Authenticate for Pokemon Game with nonce: ${nonce}`;
    console.log("Message to sign:", message);

    const signature = await signer.signMessage(message);
    console.log("Signature:", signature);

    const token = await verifySignature(walletAddress, signature);
    console.log("Authentication completed successfully");
    return token;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
