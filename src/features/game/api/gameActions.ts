import { GameState } from "@/entities/game";
import { MOCK_POKEMONS } from "@/entities/pokemon/model/mock";

let mockGameState: GameState = {
  id: "1",
  status: "active",
  playerPokemon: MOCK_POKEMONS["25"], // Pikachu
  opponentPokemon: MOCK_POKEMONS["6"], // Charizard
};

export const createGame = async (): Promise<string> => {
  // Reset game state
  mockGameState = {
    id: Math.random().toString(36).substring(7),
    status: "active",
    playerPokemon: MOCK_POKEMONS["25"],
    opponentPokemon: MOCK_POKEMONS["6"],
  };
  return mockGameState.id;
};

export const getGameState = async (gameId: string): Promise<GameState> => {
  return mockGameState;
};

export const attack = async (gameId: string): Promise<void> => {
  // Simulate battle
  const damage = Math.floor(Math.random() * 20) + 10;
  mockGameState.opponentPokemon.hp -= damage;

  // Check if opponent is defeated
  if (mockGameState.opponentPokemon.hp <= 0) {
    mockGameState.opponentPokemon.hp = 0;
    mockGameState.status = "won";
    return;
  }

  // Opponent attacks back
  setTimeout(() => {
    const opponentDamage = Math.floor(Math.random() * 20) + 10;
    mockGameState.playerPokemon.hp -= opponentDamage;

    if (mockGameState.playerPokemon.hp <= 0) {
      mockGameState.playerPokemon.hp = 0;
      mockGameState.status = "lost";
    }
  }, 1000);
};
