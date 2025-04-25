import { Pokemon } from "./types";

const createMove = (name: string, power: number, type: string) => ({
  name,
  power,
  type,
  accuracy: 100,
});

export const MOCK_POKEMONS: Record<string, Pokemon> = {
  "25": {
    id: "25",
    name: "Pikachu",
    types: ["electric"],
    stats: {
      hp: 100,
      attack: 55,
      defense: 40,
      speed: 90,
    },
    level: 50,
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
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
    types: ["fire"],
    stats: {
      hp: 100,
      attack: 84,
      defense: 78,
      speed: 100,
    },
    level: 50,
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    moves: [
      createMove("Flamethrower", 90, "fire"),
      createMove("Dragon Claw", 80, "fire"),
      createMove("Air Slash", 75, "fire"),
      createMove("Fire Blast", 110, "fire"),
    ],
  },
};
