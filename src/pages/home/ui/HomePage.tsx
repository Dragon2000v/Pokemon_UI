import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/entities/web3";
import { createGame } from "@/features/game";
import { getAllPokemons } from "@/features/pokemon/api/pokemon";
import { Pokemon, PokemonFromServer } from "@/entities/pokemon/model/types";
import { Button } from "@/shared/ui/button";
import { PokemonCard } from "@/entities/pokemon/ui/PokemonCard";
import { AxiosError } from "axios";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const { signer, connect } = useWeb3();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      if (!signer) {
        console.log("No signer available, clearing pokemons");
        setPokemons([]);
        setSelectedPokemonId(null);
        return;
      }

      setLoading(true);
      try {
        console.log("Starting to fetch pokemons...");
        const token = localStorage.getItem("token");
        console.log("Using token:", token);

        const data = await getAllPokemons();
        console.log("Raw pokemon data:", JSON.stringify(data, null, 2));

        if (!data) {
          console.error("No data received from API");
          setPokemons([]);
          return;
        }

        // Проверяем что данные действительно являются массивом
        if (Array.isArray(data)) {
          // Преобразуем данные в нужный формат
          const transformedPokemons = data.map(
            (pokemon: PokemonFromServer) => ({
              id: pokemon._id,
              name: pokemon.name,
              hp: pokemon.hp,
              attack: pokemon.attack,
              type: Array.isArray(pokemon.type)
                ? pokemon.type[0]
                : pokemon.type,
              moves: pokemon.moves.map((move) => ({
                name: move.name,
                power: move.power,
                type: move.type,
              })),
              imageUrl: pokemon.imageUrl,
            })
          );

          console.log("Transformed pokemons:", transformedPokemons);
          setPokemons(transformedPokemons);
        } else {
          console.error("Received invalid pokemon data format:", data);
          setPokemons([]);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching pokemons:", axiosError);
        if (axiosError.response) {
          console.error("Response data:", axiosError.response.data);
          console.error("Response status:", axiosError.response.status);
          if (axiosError.response.status === 401) {
            console.error("Authentication failed - token may be invalid");
            localStorage.removeItem("token");
          }
        }
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    if (signer && localStorage.getItem("token")) {
      console.log("Signer and token available, fetching pokemons");
      fetchPokemons();
    } else {
      console.log("Missing signer or token, skipping fetch");
      setPokemons([]);
    }
  }, [signer]);

  const handleCreateGame = async () => {
    if (!signer) {
      console.log("No signer, connecting wallet...");
      await connect();
      return;
    }

    if (!selectedPokemonId) {
      alert("Пожалуйста, выберите покемона");
      return;
    }

    try {
      setIsCreatingGame(true);
      console.log("Creating game with pokemon:", selectedPokemonId);
      const gameId = await createGame(selectedPokemonId);
      console.log("Game created with ID:", gameId);

      if (!gameId) {
        throw new Error("Не удалось получить ID игры");
      }

      // Добавляем небольшую задержку перед переходом
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      alert(errorMessage);
      setIsCreatingGame(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-32 h-32">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Loading..."
            className="w-full h-full animate-bounce"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pokemon Battle
          </h1>
          <p className="text-xl mb-8 text-text/80">
            Подключи свой кошелек и начни сражение с покемонами! Брось вызов
            компьютеру в эпической пошаговой битве.
          </p>
        </div>

        {signer ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">
              Выберите своего покемона
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pokemons.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className={`
                    cursor-pointer rounded-lg overflow-hidden
                    ${
                      selectedPokemonId === pokemon.id
                        ? "ring-4 ring-primary"
                        : "hover:ring-2 hover:ring-primary/50"
                    }
                  `}
                  onClick={() => setSelectedPokemonId(pokemon.id)}
                >
                  <PokemonCard pokemon={pokemon} size="small" />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleCreateGame}
                className="w-full max-w-md text-lg"
                disabled={!selectedPokemonId || isCreatingGame}
              >
                {isCreatingGame ? "Создание игры..." : "Начать игру"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Button onClick={connect} className="w-full max-w-md text-lg">
              Подключить кошелек
            </Button>
            <p className="text-sm text-text/60">
              Для игры нужно подключить кошелек. Нет кошелька?{" "}
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Установить MetaMask
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
