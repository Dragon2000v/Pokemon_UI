import { api } from "../../../shared/api";

export const createGame = async (): Promise<string> => {
  const response = await api.post("/game/create");
  return response.data.gameId;
};
