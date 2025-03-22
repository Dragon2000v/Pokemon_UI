import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";
import { getGameState, attack } from "../../../features/game/api/gameActions";
import { GameState } from "../../../entities/game";
import { PokemonCard } from "@/entities/pokemon/ui/PokemonCard";
import { BattleLog } from "@/widgets/battle-log";
import { Button } from "@/shared/ui/button";

export const GamePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signer } = useWeb3();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAttacking, setIsAttacking] = useState(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      if (!id) return;
      try {
        const state = await getGameState(id);
        setGameState(state);
        if (state.status !== "active") {
          setBattleLogs((prev) => [
            ...prev,
            `Игра ${state.status === "won" ? "выиграна!" : "проиграна!"}`,
          ]);
        }
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
    if (!id || !signer || !gameState || isAttacking) return;
    try {
      setIsAttacking(true);
      await attack(id);
      const state = await getGameState(id);
      setGameState(state);
      setBattleLogs((prev) => [
        ...prev,
        `${gameState.playerPokemon.name} использует ${
          selectedMove || "атаку"
        }!`,
      ]);
      setSelectedMove(null);
    } catch (error) {
      console.error("Error attacking:", error);
    } finally {
      setTimeout(() => setIsAttacking(false), 1000);
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-32 h-32">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Loading..."
            className="w-full h-full animate-bounce"
          />
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Игра не найдена</h2>
        <Button onClick={handleExit}>Вернуться на главную</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative min-h-[60vh] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-3xl" />

        {/* Battle Arena */}
        <div className="relative w-full grid grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <PokemonCard
              pokemon={gameState.playerPokemon}
              isAttacking={isAttacking}
              onAttack={handleAttack}
            />
          </div>
          <div className="flex justify-center">
            <PokemonCard pokemon={gameState.opponentPokemon} isOpponent />
          </div>
        </div>
      </div>

      {/* Battle Controls */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          {gameState.playerPokemon.moves.map((move, index) => (
            <Button
              key={index}
              variant={selectedMove === move.name ? "primary" : "secondary"}
              onClick={() => setSelectedMove(move.name)}
              disabled={!signer || gameState.status !== "active" || isAttacking}
            >
              {move.name}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleAttack}
          disabled={!signer || gameState.status !== "active" || isAttacking}
          className="w-48"
        >
          {isAttacking ? "Атакуем..." : "Атаковать!"}
        </Button>

        <BattleLog logs={battleLogs} />

        {gameState.status !== "active" && (
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 animate-bounce">
              {gameState.status === "won"
                ? "🎉 Победа! 🎉"
                : "😢 Поражение! 😢"}
            </div>
            <Button onClick={handleExit}>Играть снова</Button>
          </div>
        )}
      </div>
    </div>
  );
};
