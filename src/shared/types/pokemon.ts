export interface IPokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface IPokemonMove {
  name: string;
  power: number;
  type: string;
  accuracy: number;
}

export interface IPokemon {
  _id: string;
  name: string;
  type: string[];
  stats: IPokemonStats;
  moves: IPokemonMove[];
  sprite: string;
}
