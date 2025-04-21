import { Pokemon } from "@/entities/pokemon/model/types";

export type GameStatus = "active" | "finished";

export interface BattleLogEntry {
  turn: number;
  attacker: "player" | "computer";
  move?: string;
  damage: number;
  timestamp: Date;
}

export interface GameState {
  _id: string;
  player: string;
  playerPokemon: Pokemon;
  computerPokemon: Pokemon;
  status: GameStatus;
  winner?: "player" | "computer";
  currentTurn: "player" | "computer";
  battleLog: BattleLogEntry[];
  playerPokemonCurrentHP: number;
  computerPokemonCurrentHP: number;
}
