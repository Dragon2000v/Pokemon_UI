import type { Pokemon } from "../../../entities/pokemon/model/types.ts";

export interface BattleLogEntry {
  turn: number;
  attacker: "player" | "computer";
  move: string;
  damage: number;
  timestamp: Date;
}

export interface GameState {
  _id: string;
  player: string;
  playerPokemon: Pokemon;
  computerPokemon: Pokemon;
  status: "active" | "finished";
  winner?: "player" | "computer";
  currentTurn: "player" | "computer";
  battleLog: BattleLogEntry[];
  playerPokemonCurrentHP: number;
  computerPokemonCurrentHP: number;
}
