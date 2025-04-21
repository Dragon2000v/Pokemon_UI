import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";
import {
  getGameState,
  attack,
  surrender,
} from "../../../features/game/api/gameActions";
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
  const [isOpponentAttacking, setIsOpponentAttacking] = useState(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGameState = async () => {
      if (!id) return;

      try {
        const state = await getGameState(id);
        if (!isMounted) return;

        // Check if we have all required data
        if (!state.playerPokemon || !state.computerPokemon) {
          throw new Error("Invalid game state - missing pokemon data");
        }

        // Update battle logs
        if (state.battleLog && state.battleLog.length > 0) {
          const newLogs = state.battleLog.map((log) => {
            if (log.attacker === "computer") {
              return `${state.computerPokemon.name} uses ${
                log.move || "attack"
              }! Deals ${log.damage} damage!`;
            } else {
              return `${state.playerPokemon.name} uses ${
                log.move || "attack"
              }! Deals ${log.damage} damage!`;
            }
          });
          setBattleLogs(newLogs);
        }

        // Update Pokemon HP
        const updatedState = {
          ...state,
          playerPokemon: {
            ...state.playerPokemon,
            hp: state.playerPokemonCurrentHP,
            stats: state.playerPokemon.stats || {
              hp: 100,
              attack: state.playerPokemon.attack || 50,
              defense: state.playerPokemon.defense || 50,
              speed: state.playerPokemon.speed || 50,
            },
          },
          computerPokemon: {
            ...state.computerPokemon,
            hp: state.computerPokemonCurrentHP,
            stats: state.computerPokemon.stats || {
              hp: 100,
              attack: state.computerPokemon.attack || 50,
              defense: state.computerPokemon.defense || 50,
              speed: state.computerPokemon.speed || 50,
            },
          },
        };

        setGameState(updatedState);
        setError(null);
        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching game state:", error);
        setError(
          error instanceof Error ? error.message : "Error fetching game state"
        );
        setLoading(false);
      }
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  const handleAttack = async () => {
    if (!id || !gameState || isAttacking || gameState.currentTurn !== "player")
      return;

    try {
      setIsAttacking(true);
      setError(null);
      await attack(id, selectedMove || undefined);
      const newState = await getGameState(id);

      // Update Pokemon HP
      const updatedState = {
        ...newState,
        playerPokemon: {
          ...newState.playerPokemon,
          hp: newState.playerPokemonCurrentHP,
          stats: newState.playerPokemon.stats || {
            hp: 100,
            attack: newState.playerPokemon.attack || 50,
            defense: newState.playerPokemon.defense || 50,
            speed: newState.playerPokemon.speed || 50,
          },
        },
        computerPokemon: {
          ...newState.computerPokemon,
          hp: newState.computerPokemonCurrentHP,
          stats: newState.computerPokemon.stats || {
            hp: 100,
            attack: newState.computerPokemon.attack || 50,
            defense: newState.computerPokemon.defense || 50,
            speed: newState.computerPokemon.speed || 50,
          },
        },
      };

      setGameState(updatedState);
      setSelectedMove(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error attacking");
    } finally {
      setIsAttacking(false);
    }
  };

  const handleSurrender = async () => {
    if (!id || !gameState || gameState.status !== "active") return;

    try {
      setLoading(true);
      await surrender(id);
      const finalState = await getGameState(id);
      setGameState(finalState);
      setBattleLogs((prev) => [...prev, "You surrendered!"]);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error surrendering");
    } finally {
      setLoading(false);
    }
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

  if (!gameState || !gameState.playerPokemon || !gameState.computerPokemon) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">
          Game not found or invalid state
        </h2>
        <Button onClick={() => navigate("/")}>Return to main</Button>
      </div>
    );
  }

  const playerMaxHp = gameState.playerPokemon.stats?.hp || 100;
  const computerMaxHp = gameState.computerPokemon.stats?.hp || 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="relative min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-3xl" />

        <div className="relative w-full grid grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <PokemonCard
              pokemon={gameState.playerPokemon}
              maxHp={playerMaxHp}
              isAttacking={isAttacking}
              onAttack={handleAttack}
            />
          </div>
          <div className="flex justify-center">
            <PokemonCard
              pokemon={gameState.computerPokemon}
              maxHp={computerMaxHp}
              isOpponent
              isAttacking={isOpponentAttacking}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          {gameState.playerPokemon.moves?.map((move, index) => (
            <Button
              key={index}
              variant={selectedMove === move.name ? "primary" : "secondary"}
              onClick={() => setSelectedMove(move.name)}
              disabled={
                gameState.status !== "active" ||
                isAttacking ||
                gameState.currentTurn !== "player"
              }
            >
              {move.name}
            </Button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleAttack}
            disabled={
              gameState.status !== "active" ||
              isAttacking ||
              gameState.currentTurn !== "player"
            }
            className="w-48"
          >
            {isAttacking ? "Attacking..." : "Attack!"}
          </Button>

          <Button
            onClick={handleSurrender}
            disabled={gameState.status !== "active"}
            variant="outline"
            className="w-48 bg-red-500/10 hover:bg-red-500/20 text-red-500"
          >
            Surrender
          </Button>
        </div>

        <BattleLog logs={battleLogs} />

        {gameState.status === "finished" && (
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 animate-bounce">
              {gameState.winner === "player"
                ? "🎉 Victory! 🎉"
                : "😢 Defeat! 😢"}
            </div>
            <Button onClick={() => navigate("/")}>Play Again</Button>
          </div>
        )}
      </div>
    </div>
  );
};
