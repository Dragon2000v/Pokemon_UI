import { FC, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Pokemon } from "@/shared/api/types";

interface Props {
  onStart: (pokemon: Pokemon) => void;
}

const STARTER_POKEMONS: Pokemon[] = [
  {
    id: "1",
    name: "Bulbasaur",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    stats: {
      hp: 100,
      attack: 65,
      defense: 65,
      speed: 45,
    },
    types: ["grass"],
    level: 5,
    moves: [
      { name: "Vine Whip", type: "grass", power: 45, accuracy: 90 },
      { name: "Poison Powder", type: "poison", power: 35, accuracy: 85 },
      { name: "Leech Seed", type: "grass", power: 40, accuracy: 90 },
      { name: "Solar Beam", type: "grass", power: 55, accuracy: 85 },
    ],
  },
  {
    id: "4",
    name: "Charmander",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    stats: {
      hp: 100,
      attack: 70,
      defense: 55,
      speed: 65,
    },
    types: ["fire"],
    level: 5,
    moves: [
      { name: "Fire Tail", type: "fire", power: 40, accuracy: 90 },
      { name: "Scratch", type: "normal", power: 35, accuracy: 95 },
      { name: "Flamethrower", type: "fire", power: 50, accuracy: 85 },
      { name: "Smoke Screen", type: "normal", power: 30, accuracy: 100 },
    ],
  },
  {
    id: "7",
    name: "Squirtle",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    stats: {
      hp: 100,
      attack: 60,
      defense: 75,
      speed: 40,
    },
    types: ["water"],
    level: 5,
    moves: [
      { name: "Water Gun", type: "water", power: 40, accuracy: 90 },
      { name: "Bubble", type: "water", power: 35, accuracy: 95 },
      { name: "Water Tail", type: "water", power: 45, accuracy: 85 },
      { name: "Shell Defense", type: "normal", power: 30, accuracy: 100 },
    ],
  },
];

export const PokemonSelection: FC<Props> = ({ onStart }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Choose your Pokemon
      </div>
      <div className="grid grid-cols-3 gap-6 max-w-4xl">
        {STARTER_POKEMONS.map((pokemon) => (
          <div
            key={pokemon.id}
            className={`p-6 bg-surface/30 backdrop-blur-sm rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 ${
              selectedPokemon?.id === pokemon.id
                ? "ring-2 ring-primary scale-105"
                : "hover:scale-105"
            }`}
            onClick={() => setSelectedPokemon(pokemon)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{pokemon.name}</h3>
              <div className="text-sm opacity-75">HP: {pokemon.stats.hp}</div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl" />
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                className="w-full h-48 object-contain"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>Attack: {pokemon.stats.attack}</div>
              <div>Defense: {pokemon.stats.defense}</div>
              <div>Type: {pokemon.types[0]}</div>
            </div>
          </div>
        ))}
        <Button
          onClick={() => selectedPokemon && onStart(selectedPokemon)}
          disabled={!selectedPokemon}
          size="lg"
          className="col-span-3"
        >
          Start Battle
        </Button>
      </div>
    </div>
  );
};
