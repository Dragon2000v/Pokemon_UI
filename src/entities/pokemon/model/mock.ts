import { Pokemon, PokemonType } from "./types";

const createMove = (name: string, power: number, type: PokemonType) => ({
  name,
  power,
  type,
});

export const MOCK_POKEMONS: Record<string, Pokemon> = {
  "25": {
    id: "25",
    name: "Pikachu",
    hp: 100,
    attack: 55,
    type: "electric",
    moves: [
      createMove("Thunder Shock", 40, "electric"),
      createMove("Quick Attack", 40, "electric"),
      createMove("Thunderbolt", 90, "electric"),
      createMove("Iron Tail", 100, "electric"),
    ],
  },
  "6": {
    id: "6",
    name: "Charizard",
    hp: 100,
    attack: 84,
    type: "fire",
    moves: [
      createMove("Flamethrower", 90, "fire"),
      createMove("Dragon Claw", 80, "fire"),
      createMove("Air Slash", 75, "fire"),
      createMove("Fire Blast", 110, "fire"),
    ],
  },
};
