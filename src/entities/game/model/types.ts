import { Pokemon } from "@/entities/pokemon/model/types";

export interface GameState {
  id: string;
  status: GameStatus;
  playerPokemon: Pokemon;
  opponentPokemon: Pokemon;
  currentTurn?: string;
}

export type GameStatus = "active" | "won" | "lost";
