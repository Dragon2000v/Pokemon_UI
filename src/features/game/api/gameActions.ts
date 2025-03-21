import { api } from "../../../shared/api";
import { GameState } from "../../../entities/game";

export const getGameState = async (gameId: string): Promise<GameState> => {
  const response = await api.get(`/game/${gameId}`);
  return response.data;
};

export const attack = async (gameId: string): Promise<void> => {
  await api.post(`/game/${gameId}/attack`);
};
