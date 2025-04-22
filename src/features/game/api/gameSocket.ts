import { socketClient } from "@/shared/lib/socket";

export const createGame = async (
  pokemonId: string,
  isAI: boolean = true
): Promise<string> => {
  const socket = socketClient.connect();

  return new Promise((resolve, reject) => {
    socket.emit(
      "createGame",
      { pokemonId, isAI },
      (response: { gameId: string } | { error: string }) => {
        if ("error" in response) {
          reject(new Error(response.error));
        } else {
          resolve(response.gameId);
        }
      }
    );
  });
};
