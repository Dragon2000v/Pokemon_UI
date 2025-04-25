export interface Pokemon {
  id: string;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  moves: Move[];
  imageUrl: string;
  level: number;
}

export interface Move {
  name: string;
  type: string;
  power: number;
  accuracy: number;
}
