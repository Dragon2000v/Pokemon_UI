import { Pokemon, Move } from "@/shared/api/types";

export type GameState = {
  playerPokemon: Pokemon;
  computerPokemon: Pokemon;
  currentTurn: "player" | "computer";
  status: "active" | "finished";
  winner: "player" | "computer" | null;
};

export const handlePlayerMove = (
  gameState: GameState,
  moveName: string,
  onStateChange: (newState: GameState) => void,
  onLogAdd: (log: string) => void
) => {
  if (gameState.currentTurn !== "player" || gameState.status !== "active") {
    return;
  }

  const playerMove = gameState.playerPokemon.moves.find(
    (m) => m.name === moveName
  );
  if (!playerMove) return;

  // Calculate player damage
  const playerDamage = calculateDamage(
    playerMove,
    gameState.playerPokemon,
    gameState.computerPokemon
  );

  // Update computer HP
  const updatedComputerPokemon = {
    ...gameState.computerPokemon,
    stats: {
      ...gameState.computerPokemon.stats,
      hp: Math.max(0, (gameState.computerPokemon.stats.hp || 0) - playerDamage),
    },
  };

  // Check for player victory
  if (updatedComputerPokemon.stats.hp <= 0) {
    onStateChange({
      ...gameState,
      computerPokemon: updatedComputerPokemon,
      status: "finished",
      winner: "player",
    });
    onLogAdd(`${gameState.playerPokemon.name} wins the battle!`);
    return;
  }

  // Computer turn
  const computerMove = getRandomMove(gameState.computerPokemon.moves);
  const computerDamage = calculateDamage(
    computerMove,
    gameState.computerPokemon,
    gameState.playerPokemon
  );

  // Update player HP
  const updatedPlayerPokemon = {
    ...gameState.playerPokemon,
    stats: {
      ...gameState.playerPokemon.stats,
      hp: Math.max(0, (gameState.playerPokemon.stats.hp || 0) - computerDamage),
    },
  };

  // Check for computer victory
  if (updatedPlayerPokemon.stats.hp <= 0) {
    onStateChange({
      ...gameState,
      playerPokemon: updatedPlayerPokemon,
      computerPokemon: updatedComputerPokemon,
      status: "finished",
      winner: "computer",
    });
    onLogAdd(`${gameState.computerPokemon.name} wins the battle!`);
    return;
  }

  // Update game state
  onStateChange({
    ...gameState,
    playerPokemon: updatedPlayerPokemon,
    computerPokemon: updatedComputerPokemon,
    currentTurn: "player",
  });

  // Add logs
  onLogAdd(
    `${gameState.playerPokemon.name} uses ${moveName} and deals ${playerDamage} damage!`
  );
  onLogAdd(
    `${gameState.computerPokemon.name} uses ${computerMove.name} and deals ${computerDamage} damage!`
  );
};

const calculateDamage = (
  move: Move,
  attacker: Pokemon,
  defender: Pokemon
): number => {
  const baseDamage = move.power || 0;
  const attackModifier = (attacker.stats.attack || 0) / 100;
  const defenseModifier = 1 - (defender.stats.defense || 0) / 300;
  const typeMultiplier = getTypeMultiplier(move.type, defender.types[0]);

  return Math.max(
    1,
    Math.floor(
      baseDamage * attackModifier * defenseModifier * typeMultiplier * 1.5
    )
  );
};

const getTypeMultiplier = (moveType: string, defenderType: string): number => {
  // Here you can add type effectiveness logic
  return 1;
};

const getRandomMove = (moves: Move[]): Move => {
  return moves[Math.floor(Math.random() * moves.length)];
};
