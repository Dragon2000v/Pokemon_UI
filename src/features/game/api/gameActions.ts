import { GameState } from "@/entities/game";
import { api } from "@/shared/api";

export const createGame = async (pokemonId: string): Promise<string> => {
  const response = await api.post("/game/create", { pokemonId });
  return response.data.gameId;
};

export const getGameState = async (gameId: string): Promise<GameState> => {
  const response = await api.get(`/game/${gameId}`);
  return response.data;
};

export const attack = async (gameId: string): Promise<GameState> => {
  const response = await api.post(`/game/${gameId}/attack`);
  return response.data;
};
