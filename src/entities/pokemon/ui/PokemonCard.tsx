import { FC } from "react";
import { Pokemon } from "../model/types";

interface Props {
  pokemon: Pokemon;
  isOpponent?: boolean;
  isAttacking?: boolean;
  onAttack?: () => void;
}

export const PokemonCard: FC<Props> = ({
  pokemon,
  isOpponent = false,
  isAttacking = false,
  onAttack,
}) => {
  const maxHp = 100; // Максимальное значение HP
  const hpPercentage = (pokemon.hp / maxHp) * 100;
  const hpColor =
    hpPercentage > 50
      ? "bg-green-500"
      : hpPercentage > 20
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div
      className={`
        relative p-4 rounded-xl bg-surface/50 backdrop-blur-sm
        transition-all duration-300 hover:scale-105
        ${isOpponent ? "scale-x-[-1]" : ""}
      `}
    >
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold mb-2">{pokemon.name}</h3>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div
            className={`${hpColor} h-4 rounded-full transition-all duration-300`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div className="text-sm">
          HP: {pokemon.hp} / {maxHp}
        </div>
      </div>

      <div
        className={`
          relative w-48 h-48 mx-auto
          ${isAttacking ? "animate-attack" : "animate-idle"}
          ${isOpponent ? "hover:translate-x-[-8px]" : "hover:translate-x-[8px]"}
          transition-transform duration-300 cursor-pointer
        `}
        onClick={onAttack}
      >
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        {isAttacking && (
          <div className="absolute inset-0 animate-flash">
            <div className="w-full h-full bg-white/30 rounded-full blur-xl" />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-center font-semibold">
          Attack: {pokemon.attack}
        </div>
        <div className="flex justify-center gap-2">
          {pokemon.moves.map((move, index) => (
            <span
              key={index}
              className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${getTypeColor(move.type)}
              `}
            >
              {move.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    fire: "bg-red-500/50",
    water: "bg-blue-500/50",
    grass: "bg-green-500/50",
    electric: "bg-yellow-500/50",
  };
  return colors[type] || "bg-gray-500/50";
};
