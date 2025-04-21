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
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    },
    stats: {
      hp: 100,
      attack: 65,
      defense: 65,
    },
    type: "grass",
    moves: [
      { name: "Лозой хлыст", type: "grass", power: 45 },
      { name: "Ядовитый порошок", type: "poison", power: 35 },
      { name: "Семена-пиявки", type: "grass", power: 40 },
      { name: "Солнечный луч", type: "grass", power: 55 },
    ],
  },
  {
    id: "4",
    name: "Charmander",
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    },
    stats: {
      hp: 100,
      attack: 70,
      defense: 55,
    },
    type: "fire",
    moves: [
      { name: "Огненный хвост", type: "fire", power: 40 },
      { name: "Царапание", type: "normal", power: 35 },
      { name: "Огнемет", type: "fire", power: 50 },
      { name: "Дымовая завеса", type: "normal", power: 30 },
    ],
  },
  {
    id: "7",
    name: "Squirtle",
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    },
    stats: {
      hp: 100,
      attack: 60,
      defense: 75,
    },
    type: "water",
    moves: [
      { name: "Водяной пистолет", type: "water", power: 40 },
      { name: "Пузыри", type: "water", power: 35 },
      { name: "Водяной хвост", type: "water", power: 45 },
      { name: "Панцирная защита", type: "normal", power: 30 },
    ],
  },
];

export const PokemonSelection: FC<Props> = ({ onStart }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Выберите своего покемона
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
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-48 object-contain"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>Атака: {pokemon.stats.attack}</div>
              <div>Защита: {pokemon.stats.defense}</div>
              <div>Тип: {pokemon.type}</div>
            </div>
          </div>
        ))}
        <Button
          onClick={() => selectedPokemon && onStart(selectedPokemon)}
          disabled={!selectedPokemon}
          size="lg"
          className="col-span-3"
        >
          Начать битву
        </Button>
      </div>
    </div>
  );
};
