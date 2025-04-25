export type PokemonType = "fire" | "water" | "grass" | "electric";

export interface Move {
  name: string;
  power: number;
  type: string;
  accuracy: number;
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Pokemon {
  id: string;
  name: string;
  types: string[];
  stats: Stats;
  moves: Move[];
  imageUrl: string;
  level: number;
}

export interface PokemonFromServer {
  _id: string;
  name: string;
  stats: Stats;
  types: string[];
  moves: Move[];
  imageUrl: string;
  level: number;
}
