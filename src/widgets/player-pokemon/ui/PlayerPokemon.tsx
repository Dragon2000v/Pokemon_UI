import { FC } from "react";
import { Pokemon, Move } from "@/entities/pokemon/model/types";
import { Button } from "@/shared/ui/button";

interface Props {
  pokemon: Pokemon;
  onMove: (move: string) => void;
  canMove: boolean;
  isAttacking: boolean;
}

export const PlayerPokemon: FC<Props> = ({
  pokemon,
  onMove,
  canMove,
  isAttacking,
}) => {
  const defaultSprite =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

  return (
    <div className="flex flex-col gap-4">
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
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl" />
          <img
            src={pokemon.imageUrl || defaultSprite}
            alt={pokemon.name}
            className={`w-full h-48 object-contain ${
              isAttacking ? "animate-bounce" : ""
            }`}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>Атака: {pokemon.stats?.attack || 0}</div>
          <div>Защита: {pokemon.stats?.defense || 0}</div>
          <div>Тип: {pokemon.types.join(", ")}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 bg-surface/30 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="col-span-2 mb-2 text-center font-semibold">Атаки</div>
        {(pokemon.moves || []).map((move: Move, index: number) => (
          <Button
            key={index}
            onClick={() => onMove(move.name)}
            disabled={!canMove}
            variant={canMove ? "primary" : "secondary"}
            className="w-full"
          >
            {move.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
