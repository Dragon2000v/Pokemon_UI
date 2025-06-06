import { FC } from "react";
import { Pokemon } from "@/entities/pokemon/model/types";

interface Props {
  pokemon: Pokemon;
  isAttacking: boolean;
}

export const ComputerPokemon: FC<Props> = ({ pokemon, isAttacking }) => {
  const defaultSprite =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

  return (
    <div
      className={`p-6 bg-surface/30 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 ${
        isAttacking ? "scale-105" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{pokemon.name}</h3>
        <div className="text-sm opacity-75">
          HP: {pokemon.stats?.hp || 0}/100
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent rounded-xl" />
        <img
          src={pokemon.imageUrl || defaultSprite}
          alt={pokemon.name}
          className={`w-full h-48 object-contain ${
            isAttacking ? "animate-bounce" : ""
          }`}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>Attack: {pokemon.stats?.attack || 0}</div>
        <div>Defense: {pokemon.stats?.defense || 0}</div>
        <div>Type: {pokemon.types.join(", ")}</div>
      </div>
    </div>
  );
};
