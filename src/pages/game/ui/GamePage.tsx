import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";
import { getGameState, attack } from "../../../features/game/api/gameActions";
import { GameState } from "../../../entities/game";

export const GamePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { signer } = useWeb3();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameState = async () => {
      if (!id) return;
      try {
        const state = await getGameState(id);
        setGameState(state);
      } catch (error) {
        console.error("Error fetching game state:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleAttack = async () => {
    if (!id || !signer) return;
    try {
      await attack(id);
      const state = await getGameState(id);
      setGameState(state);
    } catch (error) {
      console.error("Error attacking:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gameState) {
    return <div>Game not found</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-4 bg-surface rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Your Pokemon</h2>
        <div className="space-y-2">
          <p>HP: {gameState.playerPokemon.hp}</p>
          <p>Attack: {gameState.playerPokemon.attack}</p>
        </div>
      </div>
      <div className="p-4 bg-surface rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Opponent Pokemon</h2>
        <div className="space-y-2">
          <p>HP: {gameState.opponentPokemon.hp}</p>
          <p>Attack: {gameState.opponentPokemon.attack}</p>
        </div>
      </div>
      <div className="col-span-2 flex justify-center">
        <button
          onClick={handleAttack}
          disabled={!signer || gameState.status !== "active"}
          className="px-6 py-3 bg-primary rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Attack
        </button>
      </div>
      {gameState.status !== "active" && (
        <div className="col-span-2 text-center text-2xl font-bold">
          {gameState.status === "won" ? "You won!" : "You lost!"}
        </div>
      )}
    </div>
  );
};
