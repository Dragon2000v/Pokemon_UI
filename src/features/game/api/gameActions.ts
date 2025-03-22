import { GameState } from "@/entities/game";
import { api } from "@/shared/api";
import { AxiosError } from "axios";

interface CreateGameResponse {
  playerId: string;
  player2: string;
  currentTurn: string;
  status: string;
  _id: string;
}

export const createGame = async (pokemonId: string): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!pokemonId) {
      throw new Error("Pokemon ID is required");
    }

    console.log("Creating game with pokemonId:", pokemonId);

    const response = await api.post("/game/create", {
      pokemonId: pokemonId.toString(),
    });

    console.log("Create game response:", response.data);

    // Проверяем формат ответа
    const gameData = response.data;
    if (!gameData || !gameData._id) {
      console.error("Invalid game data:", gameData);
      throw new Error("Invalid response from server: missing game data");
    }

    return gameData._id;
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error(
          "Ошибка авторизации. Пожалуйста, переподключите кошелек."
        );
      } else if (error.response?.status === 400) {
        throw new Error(
          "Неверные данные для создания игры. Попробуйте выбрать другого покемона."
        );
      } else {
        throw new Error(
          `Ошибка сервера: ${
            error.response?.data?.message || "Неизвестная ошибка"
          }`
        );
      }
    }
    throw new Error(
      "Ошибка при создании игры. Пожалуйста, попробуйте еще раз."
    );
  }
};

export const getGameState = async (gameId: string): Promise<GameState> => {
  try {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    console.log("Getting game state for:", gameId);

    const response = await api.get(`/game/${gameId}`);
    console.log("Game state response:", response.data);

    if (!response.data) {
      throw new Error("Invalid response from server: missing game state");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Игра не найдена");
      } else if (error.response?.status === 401) {
        throw new Error("Ошибка авторизации");
      }
    }
    throw error;
  }
};

export const attack = async (gameId: string): Promise<GameState> => {
  try {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    const response = await api.post(`/game/${gameId}/attack`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Игра не найдена");
      } else if (error.response?.status === 401) {
        throw new Error("Ошибка авторизации");
      }
    }
    throw error;
  }
};
