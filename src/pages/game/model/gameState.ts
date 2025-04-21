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

  // Рассчитываем урон игрока
  const playerDamage = calculateDamage(
    playerMove,
    gameState.playerPokemon,
    gameState.computerPokemon
  );

  // Обновляем HP компьютера
  const updatedComputerPokemon = {
    ...gameState.computerPokemon,
    stats: {
      ...gameState.computerPokemon.stats,
      hp: Math.max(0, (gameState.computerPokemon.stats.hp || 0) - playerDamage),
    },
  };

  // Проверяем победу игрока
  if (updatedComputerPokemon.stats.hp <= 0) {
    onStateChange({
      ...gameState,
      computerPokemon: updatedComputerPokemon,
      status: "finished",
      winner: "player",
    });
    onLogAdd(`${gameState.playerPokemon.name} побеждает в битве!`);
    return;
  }

  // Ход компьютера
  const computerMove = getRandomMove(gameState.computerPokemon.moves);
  const computerDamage = calculateDamage(
    computerMove,
    gameState.computerPokemon,
    gameState.playerPokemon
  );

  // Обновляем HP игрока
  const updatedPlayerPokemon = {
    ...gameState.playerPokemon,
    stats: {
      ...gameState.playerPokemon.stats,
      hp: Math.max(0, (gameState.playerPokemon.stats.hp || 0) - computerDamage),
    },
  };

  // Проверяем победу компьютера
  if (updatedPlayerPokemon.stats.hp <= 0) {
    onStateChange({
      ...gameState,
      playerPokemon: updatedPlayerPokemon,
      computerPokemon: updatedComputerPokemon,
      status: "finished",
      winner: "computer",
    });
    onLogAdd(`${gameState.computerPokemon.name} побеждает в битве!`);
    return;
  }

  // Обновляем состояние игры
  onStateChange({
    ...gameState,
    playerPokemon: updatedPlayerPokemon,
    computerPokemon: updatedComputerPokemon,
    currentTurn: "player",
  });

  // Добавляем логи
  onLogAdd(
    `${gameState.playerPokemon.name} использует ${moveName} и наносит ${playerDamage} урона!`
  );
  onLogAdd(
    `${gameState.computerPokemon.name} использует ${computerMove.name} и наносит ${computerDamage} урона!`
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
  const typeMultiplier = getTypeMultiplier(move.type, defender.type);

  return Math.max(
    1,
    Math.floor(
      baseDamage * attackModifier * defenseModifier * typeMultiplier * 1.5
    )
  );
};

const getTypeMultiplier = (moveType: string, defenderType: string): number => {
  // Здесь можно добавить логику эффективности типов
  return 1;
};

const getRandomMove = (moves: Move[]): Move => {
  return moves[Math.floor(Math.random() * moves.length)];
};
