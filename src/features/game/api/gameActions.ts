import { GameState } from "@/entities/game";
import { api } from "@/shared/api";
import { AxiosError } from "axios";
import { Pokemon } from "@/entities/pokemon/model/types";

const transformPokemon = (pokemon: any): Pokemon => {
  return {
    id: pokemon._id,
    name: pokemon.name,
    type: [pokemon.type],
    stats: pokemon.stats,
    moves: pokemon.moves.map((move: any) => ({
      name: move.name,
      power: move.power,
      type: move.type.toLowerCase(),
    })),
    imageUrl: pokemon.imageUrl,
    hp: pokemon.stats.hp,
  };
};

export const createGame = async (
  pokemonId: string,
  isAI: boolean = true
): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!pokemonId) {
      throw new Error("Pokemon ID is required");
    }

    console.log("Creating game with pokemonId:", pokemonId, "isAI:", isAI);

    const response = await api.post("/game/create", {
      pokemonId: pokemonId.toString(),
      isAI,
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

export const surrender = async (gameId: string): Promise<void> => {
  try {
    await api.post(`/game/${gameId}/surrender`);
    window.location.href = "/"; // Redirect immediately after successful surrender
  } catch (error) {
    console.error("Error surrendering:", error);
    throw error;
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

    if (!gameData || typeof gameData !== "object") {
      console.error("Invalid game data format:", gameData);
      throw new Error("Invalid game state data received from server");
    }

    if (!gameData.playerPokemon || !gameData.computerPokemon) {
      console.error("Missing pokemon data:", {
        playerPokemon: gameData.playerPokemon,
        computerPokemon: gameData.computerPokemon,
      });
      throw new Error("Missing pokemon data in game state");
    }

    const playerPokemon = transformPokemon(gameData.playerPokemon);
    const computerPokemon = transformPokemon(gameData.computerPokemon);

    return {
      _id: gameData._id,
      player: gameData.player,
      playerPokemon,
      computerPokemon,
      status: gameData.status,
      winner: gameData.winner,
      currentTurn: gameData.currentTurn,
      battleLog: gameData.battleLog || [],
      playerPokemonCurrentHP: gameData.playerPokemonCurrentHP,
      computerPokemonCurrentHP: gameData.computerPokemonCurrentHP,
    };
  } catch (error) {
    console.error("Error getting game state:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Game not found");
      }
    }
    throw error;
  }
};

export const attack = async (
  gameId: string,
  moveName?: string
): Promise<void> => {
  try {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    console.log("Attacking in game:", gameId, "with move:", moveName);
    await api.post(`/game/${gameId}/attack`, { moveName });
  } catch (error) {
    console.error("Error attacking:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Game not found");
      } else if (error.response?.status === 401) {
        throw new Error("Authorization error");
      } else {
        throw new Error(
          `Attack error: ${
            error.response?.data?.message || "Failed to perform attack"
          }`
        );
      }
    }
    throw error;
  }
};
