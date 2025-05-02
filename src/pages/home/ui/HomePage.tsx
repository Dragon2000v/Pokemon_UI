import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/entities/web3";
import { createGame } from "@/features/game";
import { getAllPokemons } from "@/features/pokemon/api/pokemon";
import { Pokemon, PokemonFromServer } from "@/entities/pokemon/model/types";
import { Button } from "@/shared/ui/button";
import { PokemonCard } from "@/entities/pokemon/ui/PokemonCard";
import { AxiosError } from "axios";
import { socketClient } from "@/shared/lib/socket";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const { signer, connect } = useWeb3();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        // Check if data is actually an array
        if (Array.isArray(data)) {
          // Transform data into the required format
          const transformedPokemons = data.map(
            (pokemon: PokemonFromServer): Pokemon => ({
              id: pokemon._id,
              name: pokemon.name,
              types: pokemon.types,
              moves: pokemon.moves,
              imageUrl: pokemon.imageUrl,
              stats: pokemon.stats,
              level: pokemon.level,
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

  const handleCreateGame = async (isAI: boolean) => {
    if (!signer) {
      console.log("No signer, connecting wallet...");
      await connect();
      return;
    }

    if (!selectedPokemonId) {
      setError("Please select a Pokemon");
      return;
    }

    try {
      setIsCreatingGame(true);
      setError(null);

      console.log(
        "Creating game with pokemon:",
        selectedPokemonId,
        "AI mode:",
        isAI
      );

      // Пробуем создать игру
      const gameId = await createGame(selectedPokemonId, isAI);
      console.log("Game created with ID:", gameId);

      if (!gameId) {
        throw new Error("Failed to get game ID");
      }

      // Добавляем задержку перед навигацией
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Показываем ошибку пользователю
      setError(errorMessage);

      // Если ошибка связана с сокетом, пробуем переподключиться
      if (errorMessage.includes("Socket not connected")) {
        try {
          console.log("Trying to reconnect socket...");
          socketClient.disconnect();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const newSocket = socketClient.connect();

          // Добавляем обработчики для нового подключения
          newSocket.on("connect", () => {
            console.log("Socket reconnected successfully");
          });

          newSocket.on("connect_error", (error) => {
            console.error("Socket reconnection failed:", error);
            setError("Failed to reconnect to game server");
          });
        } catch (reconnectError) {
          console.error("Failed to reconnect:", reconnectError);
          setError("Failed to reconnect to game server");
        }
      }
    } finally {
      setIsCreatingGame(false);
    }
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Pokemon Battle
          </h1>
          {!signer && (
            <p className="text-xl mb-8 text-text/80">
              Connect your wallet and start battling with Pokemon! Choose a game
              mode: against AI or against other players.
            </p>
          )}
        </div>

        {signer ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">
              Choose your Pokemon
            </h2>

            {/* Selected Pokemon Details */}
            {selectedPokemonId && (
              <div className="bg-surface/50 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
                {pokemons.map((pokemon) =>
                  pokemon.id === selectedPokemonId ? (
                    <div
                      key={pokemon.id}
                      className="flex flex-col md:flex-row gap-6 items-center"
                    >
                      <div className="w-48">
                        <PokemonCard
                          pokemon={pokemon}
                          maxHp={pokemon.stats.hp}
                          size="small"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            Characteristics
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div>Attack: {pokemon.stats.attack}</div>
                            <div>Defense: {pokemon.stats.defense}</div>
                            <div>Speed: {pokemon.stats.speed}</div>
                            <div>HP: {pokemon.stats.hp}</div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">Attacks</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {pokemon.moves.map((move, index) => (
                              <div
                                key={index}
                                className={`
                                  p-2 rounded-lg
                                  ${getTypeColor(move.type)}
                                `}
                              >
                                <div className="font-semibold">{move.name}</div>
                                <div className="text-sm opacity-80">
                                  Power: {move.power}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

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
                  <PokemonCard
                    pokemon={pokemon}
                    maxHp={pokemon.stats.hp}
                    size="small"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleCreateGame(true)}
                className="w-48 text-lg"
                disabled={!selectedPokemonId || isCreatingGame}
              >
                {isCreatingGame ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating game...
                  </div>
                ) : (
                  "Play with AI"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={connect} className="text-lg">
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
