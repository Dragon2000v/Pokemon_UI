export interface Pokemon {
  id: string;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed?: number;
  };
  type: string;
  moves: Move[];
}

export interface Move {
  name: string;
  type: string;
  power: number;
}
