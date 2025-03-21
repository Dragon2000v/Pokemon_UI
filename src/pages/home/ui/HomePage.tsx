import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";
import { createGame } from "../../../features/game";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const { signer } = useWeb3();

  const handleCreateGame = async () => {
    if (!signer) return;
    try {
      const gameId = await createGame();
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-8">Welcome to Pokemon Game</h1>
      <button
        onClick={handleCreateGame}
        disabled={!signer}
        className="px-6 py-3 bg-primary rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {signer ? "Start New Game" : "Connect Wallet to Play"}
      </button>
    </div>
  );
};
