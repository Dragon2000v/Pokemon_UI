export interface Pokemon {
  id: string;
  name: string;
  hp: number;
  attack: number;
  type: PokemonType;
  moves: Move[];
}

export type PokemonType = "fire" | "water" | "grass" | "electric";

export interface Move {
  name: string;
  power: number;
  type: PokemonType;
}
