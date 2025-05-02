import { IPokemon } from "./pokemon";

export interface IPlayer {
  address: string;
  pokemon: IPokemon;
  currentHp: number;
}

export interface IBattleLogEntry {
  turn: number;
  attacker: "player" | "computer";
  move: string;
  damage: number;
  timestamp: Date;
}

export interface IGame {
  _id: string;
  player1: IPlayer;
  player2: IPlayer;
  status: "active" | "finished";
  currentTurn: "player" | "computer";
  winner?: "player" | "computer";
  battleLog: IBattleLogEntry[];
  playerPokemon: IPokemon;
  computerPokemon: IPokemon;
  playerPokemonCurrentHP: number;
  computerPokemonCurrentHP: number;
}
