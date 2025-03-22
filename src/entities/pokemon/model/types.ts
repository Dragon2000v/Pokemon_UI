export interface Pokemon {
  id: string;
  _id?: string; // Для совместимости с MongoDB
  name: string;
  hp: number;
  attack: number;
  type: PokemonType | PokemonType[];
  moves: Move[];
  imageUrl: string;
  defense?: number;
  speed?: number;
}

export type PokemonType =
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "normal"
  | "flying"
  | "poison"
  | "ground"
  | "ice"
  | "steel"
  | "dragon";

export interface Move {
  _id?: string; // Для совместимости с MongoDB
  name: string;
  power: number;
  type: PokemonType;
}

export interface PokemonFromServer {
  _id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  type: PokemonType[];
  moves: Move[];
  imageUrl: string;
}
