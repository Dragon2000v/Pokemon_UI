import { FC } from "react";
import { Pokemon } from "../model/types";

interface Props {
  pokemon: Pokemon;
  maxHp: number;
  isOpponent?: boolean;
  isAttacking?: boolean;
  onAttack?: () => void;
  size?: "small" | "large";
}

export const PokemonCard: FC<Props> = ({
  pokemon,
  maxHp,
  isOpponent = false,
  isAttacking = false,
  onAttack,
  size = "large",
}) => {
  const hpPercentage = (pokemon.hp / maxHp) * 100;
  const hpColor =
    hpPercentage > 50
      ? "bg-green-500"
      : hpPercentage > 20
      ? "bg-yellow-500"
      : "bg-red-500";

  const imageSize = size === "small" ? "w-32 h-32" : "w-48 h-48";
  const textSize = size === "small" ? "text-base" : "text-xl";
  const padding = size === "small" ? "p-2" : "p-4";

  return (
    <div
      className={`
        relative ${padding} rounded-xl bg-surface/50 backdrop-blur-sm
        transition-all duration-300 hover:scale-105 w-full
      `}
    >
      <div className="mb-2 text-center">
        <h3 className={`${textSize} font-bold mb-2`}>{pokemon.name}</h3>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div
            className={`${hpColor} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div className="text-sm">
          HP: {pokemon.hp} / {maxHp}
        </div>
      </div>

      <div
        className={`
          relative ${imageSize} mx-auto
          ${isAttacking ? "animate-attack" : "animate-idle"}
          transition-transform duration-300 cursor-pointer
          ${isOpponent ? "scale-x-[-1]" : ""}
        `}
        onClick={onAttack}
      >
        <img
          src={
            pokemon.imageUrl ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
          }
          alt={pokemon.name}
          className={`
            w-full h-full object-contain drop-shadow-2xl
            ${isOpponent ? "scale-x-[-1]" : ""}
          `}
        />
        {isAttacking && (
          <div className="absolute inset-0 animate-flash">
            <div className="w-full h-full bg-white/30 rounded-full blur-xl" />
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <div className="text-center font-semibold text-sm">
          Attack: {pokemon.attack}
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {pokemon.moves?.map((move, index) => (
            <span
              key={index}
              className={`
                px-2 py-0.5 rounded-full text-xs font-medium
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

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    fire: "bg-red-500/20 text-red-500",
    water: "bg-blue-500/20 text-blue-500",
    grass: "bg-green-500/20 text-green-500",
    electric: "bg-yellow-500/20 text-yellow-500",
  };
  return colors[type] || "bg-gray-500/20 text-gray-500";
};
