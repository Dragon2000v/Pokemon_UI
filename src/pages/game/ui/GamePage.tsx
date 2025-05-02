import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";
import { GameState } from "../../../entities/game";
import { PokemonCard } from "@/entities/pokemon/ui/PokemonCard";
import { BattleLog } from "@/widgets/battle-log";
import { Button } from "@/shared/ui/button";
import { socketClient } from "@/shared/lib/socket";
import React from "react";

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
  const [initialPlayerPokemon, setInitialPlayerPokemon] = useState<any>(null);
  const [initialComputerPokemon, setInitialComputerPokemon] =
    useState<any>(null);
  const [moveDamages, setMoveDamages] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;

    const socket = socketClient.connect();
    console.log("Joining game:", id);

    socket.emit("game:join", id);

    socket.on("gameState", (state: GameState) => {
      console.log("Received game state:", state);

      // Save initial pokemon data
      if (!initialPlayerPokemon && state.playerPokemon) {
        const playerPokemon = {
          ...state.playerPokemon,
          initialStats: { ...state.playerPokemon.stats },
        };
        setInitialPlayerPokemon(playerPokemon);
      }
      if (!initialComputerPokemon && state.computerPokemon) {
        const computerPokemon = {
          ...state.computerPokemon,
          initialStats: { ...state.computerPokemon.stats },
        };
        setInitialComputerPokemon(computerPokemon);
      }

      // Preserve moves, images and initial stats when updating state
      const updatedState = {
        ...state,
        playerPokemon: {
          ...state.playerPokemon,
          moves: state.playerPokemon?.moves || initialPlayerPokemon?.moves,
          imageUrl:
            state.playerPokemon?.imageUrl || initialPlayerPokemon?.imageUrl,
          initialStats: initialPlayerPokemon?.initialStats,
        },
        computerPokemon: {
          ...state.computerPokemon,
          moves: state.computerPokemon?.moves || initialComputerPokemon?.moves,
          imageUrl:
            state.computerPokemon?.imageUrl || initialComputerPokemon?.imageUrl,
          initialStats: initialComputerPokemon?.initialStats,
        },
      };

      setGameState(updatedState);
      setLoading(false);

      if (!state) {
        console.error("Received empty game state");
        return;
      }

      const currentBattleLog = state.battleLog || [];
      console.log("Battle log received:", currentBattleLog);

      if (currentBattleLog.length > 0) {
        const newLogs = currentBattleLog.map((log) => {
          if (!log || !log.attacker) {
            console.error("Invalid log entry:", log);
            return "Invalid battle log entry";
          }

          const attacker =
            log.attacker === "computer"
              ? state.computerPokemon
              : state.playerPokemon;
          const defender =
            log.attacker === "computer"
              ? state.playerPokemon
              : state.computerPokemon;

          if (!attacker || !defender) {
            console.error("Missing pokemon data:", { attacker, defender });
            return "Missing pokemon data";
          }

          const move = attacker.moves?.find((m) => m.name === log.move);
          const moveType = move?.type || "";
          const effectiveness = getTypeMultiplier(moveType, defender.types);
          const attackModifier = attacker.stats?.attack / 100 || 1;
          const defenseModifier = 1 - (defender.stats?.defense || 0) / 300;

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

        console.log("Processed battle logs:", newLogs);
        setBattleLogs(newLogs);
      }
    });

    socket.on("error", (errorMessage: string) => {
      console.error("Socket error:", errorMessage);
      setError(errorMessage);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("gameState");
      socket.off("error");
    };
  }, [id, initialPlayerPokemon, initialComputerPokemon]);

  // Add damage calculation effect
  useEffect(() => {
    if (!gameState?.playerPokemon?.moves) return;

    const newDamages = gameState.playerPokemon.moves.reduce((acc, move) => {
      if (!move || !move.name) return acc;

      const damage = calculateMoveDamage(
        move,
        gameState.playerPokemon || initialPlayerPokemon,
        gameState.computerPokemon || initialComputerPokemon
      );

      return { ...acc, [move.name]: damage };
    }, {});

    setMoveDamages(newDamages);
  }, [
    gameState?.playerPokemon?.stats,
    gameState?.computerPokemon?.stats,
    initialPlayerPokemon,
    initialComputerPokemon,
  ]);

  const handleAttack = async () => {
    if (!id || !gameState || !selectedMove) {
      setError("Cannot make move: missing required data");
      return;
    }

    if (gameState.status !== "active") {
      setError("Game is not active");
      return;
    }

    if (gameState.currentTurn !== "player") {
      setError("Not your turn");
      return;
    }

    try {
      setIsAttacking(true);
      setError(null);

      const socket = socketClient.getSocket();
      if (!socket) throw new Error("Socket not connected");

      const playerPokemon = gameState.playerPokemon;
      const computerPokemon = gameState.computerPokemon;
      const move = playerPokemon.moves.find((m) => m.name === selectedMove);

      if (!move) {
        throw new Error("Selected move not found");
      }

      const damage = calculateMoveDamage(move, playerPokemon, computerPokemon);

      console.log("Making move:", {
        gameId: id,
        move: selectedMove,
        damage,
      });

      socket.emit("game:move", {
        gameId: id,
        move: selectedMove,
        damage,
      });

      setSelectedMove(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAttacking(false);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsOpponentAttacking(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsOpponentAttacking(false);
    } catch (error) {
      console.error("Attack error:", error);
      setError(error instanceof Error ? error.message : "Error attacking");
      setIsAttacking(false);
      setIsOpponentAttacking(false);
    }
  };

  const handleSurrender = async () => {
    if (!id) {
      setError("Game ID not found");
      return;
    }

    try {
      setError(null);
      const socket = socketClient.getSocket();
      if (!socket) throw new Error("Socket not connected");

      console.log("Surrendering game:", id);
      socket.emit("game:surrender", { gameId: id });

      // Optionally update local state to show surrender
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              status: "finished",
              winner: "computer",
            }
          : null
      );
    } catch (error) {
      console.error("Surrender error:", error);
      setError(error instanceof Error ? error.message : "Error surrendering");
    }
  };

  const getTypeMultiplier = (
    moveType: string,
    defenderTypes: string | string[] | undefined
  ): number => {
    // Normalize and validate moveType
    const normalizedMoveType = moveType?.toLowerCase() || "normal";

    const typeChart: Record<string, Record<string, number>> = {
      normal: { normal: 1 },
      fire: {
        water: 0.75,
        grass: 1.5,
        fire: 0.75,
        normal: 1,
        ground: 1,
        electric: 1,
      },
      water: {
        fire: 1.5,
        grass: 0.75,
        water: 0.75,
        normal: 1,
        ground: 1.25,
        electric: 0.75,
      },
      grass: {
        fire: 0.75,
        water: 1.5,
        grass: 0.75,
        normal: 1,
        ground: 1.25,
        electric: 1,
      },
      electric: {
        water: 1.5,
        grass: 0.75,
        electric: 0.75,
        normal: 1,
        ground: 0.5,
        fire: 1,
      },
      ground: {
        fire: 1.25,
        water: 1,
        grass: 0.75,
        electric: 1.5,
        normal: 1,
        ground: 1,
      },
    };

    // Handle undefined or invalid types
    if (
      !defenderTypes ||
      (Array.isArray(defenderTypes) && defenderTypes.length === 0) ||
      (typeof defenderTypes === "string" && !defenderTypes.trim())
    ) {
      return 1;
    }

    // Convert to array if string
    const types = Array.isArray(defenderTypes)
      ? defenderTypes
      : [defenderTypes];

    // Get first valid type or default to normal
    const defenderType = types[0]?.toLowerCase() || "normal";

    // Get type chart for move
    const moveTypeChart = typeChart[normalizedMoveType];
    if (!moveTypeChart) {
      console.warn(`Unknown move type: ${normalizedMoveType}`);
      return 1;
    }

    // Get multiplier or default to 1
    const multiplier = moveTypeChart[defenderType];
    if (typeof multiplier !== "number") {
      console.warn(`Unknown defender type: ${defenderType}`);
      return 1;
    }

    return multiplier;
  };

  // Update damage calculation to handle undefined types
  const calculateMoveDamage = (
    move: any,
    attacker: any,
    defender: any
  ): number => {
    if (!move || !attacker || !defender) {
      console.warn("Missing data for damage calculation:", {
        move,
        attacker,
        defender,
      });
      return 0;
    }

    // Get move power with fallback
    const baseDamage = move.power || 0;

    // Get stats with fallbacks to initial pokemon data
    const attackStat =
      attacker?.stats?.attack || attacker?.initialStats?.attack || 100;
    const defenseStat =
      defender?.stats?.defense || defender?.initialStats?.defense || 80;

    // Scale down attack and defense modifiers
    const attackModifier = Math.min(1.5, Math.max(0.5, attackStat / 150)); // 0.5x to 1.5x
    const defenseModifier = Math.min(0.8, Math.max(0.2, 1 - defenseStat / 400)); // 20% to 80% reduction

    // Calculate type effectiveness with proper type handling
    const moveType = move.type?.toLowerCase() || "normal";
    const defenderTypes = defender.types || ["normal"];

    try {
      const typeMultiplier = getTypeMultiplier(moveType, defenderTypes);

      // Final damage calculation with reduced base multiplier
      const finalDamage = Math.max(
        1,
        Math.floor(
          baseDamage * attackModifier * defenseModifier * typeMultiplier * 0.8 // Reduced base multiplier
        )
      );

      console.log("Damage calculation details:", {
        moveName: move.name,
        baseDamage,
        attackStat,
        defenseStat,
        attackModifier,
        defenseModifier,
        typeMultiplier,
        finalDamage,
        moveType,
        defenderTypes,
      });

      return finalDamage;
    } catch (error) {
      console.error("Error calculating damage:", error);
      return 1; // Return minimum damage on error
    }
  };

  // Update getFallbackImageUrl function
  const getFallbackImageUrl = (pokemon: any, isPlayer: boolean) => {
    if (pokemon?.imageUrl) return pokemon.imageUrl;

    const initialPokemon = isPlayer
      ? initialPlayerPokemon
      : initialComputerPokemon;
    if (initialPokemon?.imageUrl) return initialPokemon.imageUrl;

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      pokemon?.id || 1
    }.png`;
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
                moves:
                  gameState.playerPokemon.moves ||
                  initialPlayerPokemon?.moves ||
                  [],
                imageUrl: getFallbackImageUrl(gameState.playerPokemon, true),
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
                moves:
                  gameState.computerPokemon.moves ||
                  initialComputerPokemon?.moves ||
                  [],
                imageUrl: getFallbackImageUrl(gameState.computerPokemon, false),
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
          {(
            gameState.playerPokemon?.moves ||
            initialPlayerPokemon?.moves ||
            []
          )?.map((move, index) => {
            // Skip rendering if move is invalid
            if (!move || !move.name) return null;

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
                <span className="text-xs opacity-80">
                  Damage: {moveDamages[move.name] || 0}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleAttack}
            disabled={
              !selectedMove ||
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
