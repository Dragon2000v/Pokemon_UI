export interface Pokemon {
  id: string;
  name: string;
  hp: number;
  attack: number;
}

export interface GameState {
  id: string;
  status: "active" | "won" | "lost";
  playerPokemon: Pokemon;
  opponentPokemon: Pokemon;
}
