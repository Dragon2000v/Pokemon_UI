import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";
import { GameState } from "../../../entities/game";
import { PokemonCard } from "@/entities/pokemon/ui/PokemonCard";
import { BattleLog } from "@/widgets/battle-log";
import { Button } from "@/shared/ui/button";
import { socketClient } from "@/shared/lib/socket";

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
    if (!id) return;

    const socket = socketClient.connect();

    socket.emit("joinGame", id);

    socket.on("gameState", (state: GameState) => {
      setGameState(state);
      setLoading(false);

      if (state.battleLog && state.battleLog.length > 0) {
        const newLogs = state.battleLog.map((log) => {
          const attacker =
            log.attacker === "computer"
              ? state.computerPokemon
              : state.playerPokemon;
          const defender =
            log.attacker === "computer"
              ? state.playerPokemon
              : state.computerPokemon;
          const move = attacker.moves.find((m) => m.name === log.move);
          const moveType = move?.type || "";
          const effectiveness = getTypeMultiplier(moveType, defender.types);
          const attackModifier = attacker.stats.attack / 100;
          const defenseModifier = 1 - defender.stats.defense / 300;

          let effectivenessText = "";
          let damageCalculation = "";

          if (log.damage > 1) {
            if (effectiveness > 1) {
              effectivenessText = "(Super effective!)";
            } else if (effectiveness < 1) {
              effectivenessText = "(Not very effective...)";
            }

            damageCalculation = `Base damage ${
              move?.power || 0
            } × Attack (${Math.round(
              attackModifier * 100
            )}%) × Defense (${Math.round(
              (1 - defenseModifier) * 100
            )}%) × Type (${effectiveness}x) × 1.5 = ${log.damage}`;
          } else {
            damageCalculation = "Attack was too weak...";
          }

          return `${log.attacker === "player" ? "PLAYER TURN" : "AI TURN"}\n${
            log.attacker === "player" ? "Your" : "Enemy"
          } ${attacker.name} uses ${log.move}! ${effectivenessText} Deals ${
            log.damage
          } damage! ${damageCalculation}`;
        });
        setBattleLogs(newLogs);
      }
    });

    socket.on("error", (errorMessage: string) => {
      setError(errorMessage);
    });

    return () => {
      socket.off("gameState");
      socket.off("error");
    };
  }, [id]);

  const handleAttack = async () => {
    if (!id || !gameState || !selectedMove) return;

    try {
      setIsAttacking(true);
      setError(null);

      const socket = socketClient.getSocket();
      if (!socket) throw new Error("Socket not connected");

      socket.emit("attack", { gameId: id, moveName: selectedMove });
      setSelectedMove(null);

      // Add delay for attack animation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAttacking(false);

      // Add delay before computer's attack
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsOpponentAttacking(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsOpponentAttacking(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error attacking");
      setIsAttacking(false);
      setIsOpponentAttacking(false);
    }
  };

  const handleSurrender = async () => {
    if (!id || !gameState || gameState.status !== "active") return;

    try {
      const socket = socketClient.getSocket();
      if (!socket) throw new Error("Socket not connected");

      socket.emit("surrender", id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error surrendering");
    }
  };

  const getTypeMultiplier = (
    moveType: string,
    defenderTypes: string | string[]
  ): number => {
    const typeChart: Record<string, Record<string, number>> = {
      fire: { water: 0.5, grass: 2, electric: 1, fire: 0.5 },
      water: { fire: 2, grass: 0.5, electric: 0.5, water: 0.5 },
      grass: { fire: 0.5, water: 2, electric: 1, grass: 0.5 },
      electric: { fire: 1, water: 2, grass: 0.5, electric: 0.5 },
    };

    // If defender's type is an array, take the first type
    const defenderType = Array.isArray(defenderTypes)
      ? defenderTypes[0] || "normal"
      : defenderTypes || "normal";

    return typeChart[moveType.toLowerCase()]?.[defenderType.toLowerCase()] || 1;
  };

  const calculateMoveDamage = (
    move: any,
    attacker: any,
    defender: any
  ): number => {
    // Base damage from move power
    const baseDamage = move.power;

    // Apply attack and defense modifiers
    const attackModifier = attacker.stats.attack / 100;
    const defenseModifier = 1 - defender.stats.defense / 300;

    // Calculate type effectiveness
    const typeMultiplier = getTypeMultiplier(move.type, defender.types);

    // Final damage calculation with increased base multiplier
    const finalDamage =
      baseDamage * attackModifier * defenseModifier * typeMultiplier * 1.5; // Increased base multiplier

    // Ensure minimum damage of 1
    return Math.max(1, Math.floor(finalDamage));
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
              pokemon={{
                ...gameState.playerPokemon,
                stats: {
                  ...gameState.playerPokemon.stats,
                  hp: gameState.playerPokemonCurrentHP,
                },
              }}
              maxHp={playerMaxHp}
              isAttacking={isAttacking}
              onAttack={handleAttack}
            />
          </div>
          <div className="flex justify-center">
            <PokemonCard
              pokemon={{
                ...gameState.computerPokemon,
                stats: {
                  ...gameState.computerPokemon.stats,
                  hp: gameState.computerPokemonCurrentHP,
                },
              }}
              maxHp={computerMaxHp}
              isOpponent
              isAttacking={isOpponentAttacking}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          {gameState.playerPokemon.moves?.map((move, index) => {
            const damage = calculateMoveDamage(
              move,
              gameState.playerPokemon,
              gameState.computerPokemon
            );
            return (
              <Button
                key={index}
                variant={selectedMove === move.name ? "primary" : "secondary"}
                onClick={() => setSelectedMove(move.name)}
                disabled={
                  gameState.status !== "active" ||
                  isAttacking ||
                  gameState.currentTurn !== "player"
                }
                className="flex flex-col items-center"
              >
                <span>{move.name}</span>
                <span className="text-xs opacity-80">Damage: {damage}</span>
              </Button>
            );
          })}
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
