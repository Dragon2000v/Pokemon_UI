import { api } from "@/shared/api";
import { Pokemon, PokemonFromServer } from "@/entities/pokemon/model/types";

export const getAllPokemons = async (): Promise<PokemonFromServer[]> => {
  const response = await api.get("/pokemon");
  return response.data;
};

export const getPokemon = async (id: string): Promise<Pokemon> => {
  const response = await api.get(`/pokemon/${id}`);
  return response.data;
};
