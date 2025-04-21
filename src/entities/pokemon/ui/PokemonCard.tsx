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
        <div className="flex flex-wrap justify-center gap-2">
          {Array.isArray(pokemon.type) ? (
            pokemon.type.map((type, index) => (
              <span
                key={index}
                className={`
                  px-3 py-1 rounded-full text-xs font-bold
                  shadow-md hover:shadow-lg transition-shadow duration-200
                  ${getTypeColor(type)}
                `}
              >
                {(type as string).toUpperCase()}
              </span>
            ))
          ) : (
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-bold
                shadow-md hover:shadow-lg transition-shadow duration-200
                ${getTypeColor(pokemon.type)}
              `}
            >
              {(pokemon.type as string).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    fire: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30",
    water:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30",
    grass:
      "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30",
    electric:
      "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-yellow-500/30",
    normal:
      "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-500/30",
    fighting:
      "bg-gradient-to-r from-red-700 to-red-800 text-white shadow-red-700/30",
    flying:
      "bg-gradient-to-r from-blue-300 to-blue-400 text-white shadow-blue-300/30",
    poison:
      "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/30",
    ground:
      "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-yellow-600/30",
    rock: "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-gray-600/30",
    bug: "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-400/30",
    ghost:
      "bg-gradient-to-r from-purple-700 to-purple-800 text-white shadow-purple-700/30",
    steel:
      "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/30",
    psychic:
      "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-500/30",
    ice: "bg-gradient-to-r from-blue-200 to-blue-300 text-white shadow-blue-200/30",
    dragon:
      "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-purple-600/30",
    dark: "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-gray-800/30",
    fairy:
      "bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-pink-300/30",
  };
  return (
    colors[type.toLowerCase()] ||
    "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-400/30"
  );
};
