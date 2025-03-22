import { api } from "@/shared/api";
import { JsonRpcSigner } from "ethers";

export const getNonce = async (walletAddress: string) => {
  const response = await api.post("/auth/nonce", { walletAddress });
  return response.data.nonce;
};

export const verifySignature = async (
  walletAddress: string,
  signature: string
) => {
  const response = await api.post("/auth/verify", { walletAddress, signature });
  const { token } = response.data;
  localStorage.setItem("token", token);
  return token;
};

export const authenticate = async (signer: JsonRpcSigner) => {
  const walletAddress = await signer.getAddress();
  const { nonce } = await getNonce(walletAddress);
  const message = `Sign this message to verify your identity. Nonce: ${nonce}`;
  const signature = await signer.signMessage(message);
  return verifySignature(walletAddress, signature);
};
