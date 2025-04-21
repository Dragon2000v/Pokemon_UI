export type PokemonType = "fire" | "water" | "grass" | "electric";

export interface Move {
  name: string;
  power: number;
  type: PokemonType;
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
  type: PokemonType[];
  stats: Stats;
  moves: Move[];
  imageUrl?: string;
  hp: number; // Current HP
  // Legacy fields for backward compatibility
  attack?: number;
  defense?: number;
  speed?: number;
}

export interface PokemonFromServer {
  _id: string;
  name: string;
  stats: Stats;
  type: PokemonType[];
  moves: Move[];
  imageUrl: string;
}
