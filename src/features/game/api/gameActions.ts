import { GameState } from "@/entities/game";
import { MOCK_POKEMONS } from "@/entities/pokemon/model/mock";

const mockGameState: GameState = {
  id: "1",
  status: "active",
  playerPokemon: MOCK_POKEMONS[0], // Pikachu
  opponentPokemon: MOCK_POKEMONS[1], // Charizard
};

let currentGameState = { ...mockGameState };

export const createGame = async (): Promise<string> => {
  currentGameState = { ...mockGameState };
  return currentGameState.id;
};

export const getGameState = async (): Promise<GameState> => {
  return currentGameState;
};

export const attack = async (moveName: string): Promise<GameState> => {
  const move = currentGameState.playerPokemon.moves.find(
    (m) => m.name === moveName
  );
  if (!move) throw new Error("Move not found");

  // Рассчитываем урон игрока
  const playerDamage = Math.floor(
    (currentGameState.playerPokemon.attack * move.power) / 100
  );
  currentGameState.opponentPokemon.hp -= playerDamage;

  // Рассчитываем ответный урон противника
  const opponentMove =
    currentGameState.opponentPokemon.moves[
      Math.floor(Math.random() * currentGameState.opponentPokemon.moves.length)
    ];
  const opponentDamage = Math.floor(
    (currentGameState.opponentPokemon.attack * opponentMove.power) / 100
  );
  currentGameState.playerPokemon.hp -= opponentDamage;

  // Проверяем условия победы/поражения
  if (currentGameState.opponentPokemon.hp <= 0) {
    currentGameState.status = "won";
  } else if (currentGameState.playerPokemon.hp <= 0) {
    currentGameState.status = "lost";
  }

  return currentGameState;
};
