export interface Pokemon {
  id: string;
  name: string;
  hp: number;
  attack: number;
  type: PokemonType;
  moves: Move[];
  imageUrl: string;
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
  name: string;
  power: number;
  type: PokemonType;
}

export interface PokemonFromServer {
  _id: string;
  name: string;
  hp: number;
  attack: number;
  type: PokemonType[];
  moves: Move[];
  imageUrl: string;
}
