import { GameState } from "@/entities/game";
import { api } from "@/shared/api";
import { AxiosError } from "axios";

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
    console.log("Raw game state response:", response.data);

    const gameData = response.data;

    // Проверяем наличие всех необходимых полей
    if (!gameData || typeof gameData !== "object") {
      console.error("Invalid game data format:", gameData);
      throw new Error("Invalid game state data received from server");
    }

    if (!gameData.player1 || !gameData.player2) {
      console.error("Missing player data:", {
        player1: gameData.player1,
        player2: gameData.player2,
      });
      throw new Error("Missing player data in game state");
    }

    // Определяем, какой покемон принадлежит текущему игроку
    const token = localStorage.getItem("token");
    const isPlayer1 = token === gameData.player1.address;

    const playerPokemon = isPlayer1
      ? gameData.player1.pokemon
      : gameData.player2.pokemon;
    const opponentPokemon = isPlayer1
      ? gameData.player2.pokemon
      : gameData.player1.pokemon;

    if (!playerPokemon || !opponentPokemon) {
      console.error("Missing pokemon data:", {
        playerPokemon,
        opponentPokemon,
      });
      throw new Error("Missing pokemon data in game state");
    }

    // Преобразуем данные в нужный формат
    const state: GameState = {
      id: gameData._id,
      status: gameData.status,
      currentTurn: gameData.currentTurn,
      playerPokemon: {
        id: playerPokemon._id,
        name: playerPokemon.name,
        hp: playerPokemon.hp,
        attack: playerPokemon.attack,
        type: Array.isArray(playerPokemon.type)
          ? playerPokemon.type[0]
          : playerPokemon.type,
        moves: playerPokemon.moves,
        imageUrl: playerPokemon.imageUrl,
      },
      opponentPokemon: {
        id: opponentPokemon._id,
        name: opponentPokemon.name,
        hp: opponentPokemon.hp,
        attack: opponentPokemon.attack,
        type: Array.isArray(opponentPokemon.type)
          ? opponentPokemon.type[0]
          : opponentPokemon.type,
        moves: opponentPokemon.moves,
        imageUrl: opponentPokemon.imageUrl,
      },
    };

    console.log("Transformed game state:", state);
    return state;
  } catch (error) {
    console.error("Error getting game state:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Игра не найдена");
      } else if (error.response?.status === 401) {
        throw new Error("Ошибка авторизации");
      } else {
        throw new Error(
          `Ошибка сервера: ${
            error.response?.data?.message ||
            "Не удалось получить состояние игры"
          }`
        );
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

    await api.post(`/game/${gameId}/attack`);
    return await getGameState(gameId);
  } catch (error) {
    console.error("Error performing attack:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Игра не найдена");
      } else if (error.response?.status === 401) {
        throw new Error("Ошибка авторизации");
      } else {
        throw new Error(
          `Ошибка атаки: ${
            error.response?.data?.message || "Не удалось выполнить атаку"
          }`
        );
      }
    }
    throw error;
  }
};
