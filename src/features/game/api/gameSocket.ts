import { socketClient } from "@/shared/lib/socket";
import { GameState } from "../model/types";

interface GameResponse {
  gameId: string;
  error?: never;
}

interface ErrorResponse {
  error: string;
  gameId?: never;
}

type CreateGameResponse = GameResponse | ErrorResponse;

interface GameMove {
  gameId: string;
  move: string;
  damage: number;
}

// Используем один сокет для всех операций
const socket = socketClient.connect();

// Добавляем обработчик ошибок подключения
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

export const connect = (gameId?: string) => {
  if (!socket.connected) {
    console.log("Socket not connected, trying to connect...");
    socket.connect();
  }

  if (gameId) {
    socket.emit("game:join", gameId);
  }
  return socket;
};

export const createGame = async (
  pokemonId: string,
  isAI: boolean = true
): Promise<string> => {
  if (!socket.connected) {
    console.error("Socket not connected in createGame");
    throw new Error("Socket not connected");
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error("Game creation timeout");
      reject(new Error("Game creation timeout"));
    }, 10000);

    console.log("Emitting createGame event:", { pokemonId, isAI });

    socket.emit(
      "createGame",
      { pokemonId, isAI },
      (response: CreateGameResponse) => {
        clearTimeout(timeout);
        console.log("Received createGame response:", response);

        if ("error" in response) {
          console.error("Server returned error:", response.error);
          reject(new Error(response.error));
        } else if (!response.gameId) {
          console.error("Server returned invalid response:", response);
          reject(new Error("Invalid server response"));
        } else {
          resolve(response.gameId);
        }
      }
    );

    // Добавляем обработчик ошибок для этого конкретного события
    const errorHandler = (error: Error) => {
      clearTimeout(timeout);
      console.error("Socket error during game creation:", error);
      reject(error);
    };

    socket.once("error", errorHandler);

    // Очищаем обработчик ошибок после завершения
    setTimeout(() => {
      socket.off("error", errorHandler);
    }, 10000);
  });
};

export const makeMove = (moveData: GameMove): Promise<void> => {
  if (!socket.connected) {
    console.error("Socket not connected in makeMove");
    throw new Error("Socket not connected");
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error("Move timeout");
      reject(new Error("Move timeout"));
    }, 5000);

    console.log("Emitting game:move event:", moveData);

    socket.emit("game:move", moveData, (response: { error?: string }) => {
      clearTimeout(timeout);
      console.log("Received game:move response:", response);

      if (response?.error) {
        console.error("Server returned error for move:", response.error);
        reject(new Error(response.error));
      } else {
        resolve();
      }
    });
  });
};

export const onGameState = (callback: (game: GameState) => void) => {
  socket.on("gameState", (state: GameState) => {
    console.log("Received game state:", state);
    callback(state);
  });
  return () => socket.off("gameState", callback);
};

export const disconnect = () => {
  console.log("Disconnecting socket");
  socketClient.disconnect();
};
