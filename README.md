# Pokemon Game Frontend

A modern Web3-enabled Pokemon battle game frontend built with React, TypeScript, and Web3.js.

## Features

- Web3 Wallet Integration (MetaMask)
- Responsive Material Design UI
- Real-time Battle System
- Pokemon Collection Management
- User Statistics Dashboard
- PvP and PvE Game Modes

## Tech Stack

- React 18+
- TypeScript
- Material-UI (MUI)
- Web3.js
- Socket.io Client
- Redux Toolkit
- React Router
- Axios

## Prerequisites

- Node.js 16+
- Yarn or npm
- MetaMask browser extension
- Modern web browser

## Environment Variables

Create `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_NETWORK_ID=1337 # Local network
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Pokemon_UI
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Start the development server:

```bash
yarn start
# or
npm start
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── assets/          # Images, fonts, etc.
├── components/      # Reusable components
├── config/         # Configuration files
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── store/          # Redux store
├── styles/         # Global styles
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Key Components

### Authentication

- `WalletConnect` - Web3 wallet connection component
- `AuthGuard` - Protected route wrapper
- `SignMessage` - Wallet signature component

### Game

- `BattleArena` - Main game battle component
- `PokemonCard` - Pokemon display card
- `MoveSelector` - Battle move selection
- `GameStats` - Battle statistics display

### User Interface

- `Dashboard` - User's main dashboard
- `Inventory` - Pokemon collection management
- `Statistics` - User's game statistics
- `Profile` - User profile management

## Game Flow

1. **Connection**

   - Connect Web3 wallet
   - Sign authentication message
   - Receive JWT token

2. **Game Setup**

   - Select game mode (PvP/PvE)
   - Choose Pokemon
   - Create/Join game

3. **Battle**
   - Turn-based combat
   - Select moves
   - Real-time updates
   - Battle resolution

## State Management

Using Redux Toolkit for global state management:

```typescript
interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  };
  game: {
    currentGame: Game | null;
    activeGames: Game[];
    battleLog: BattleLogEntry[];
  };
  pokemon: {
    collection: Pokemon[];
    selected: Pokemon | null;
  };
}
```

## API Integration

### Authentication

```typescript
const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
};

const signMessage = async (message: string) => {
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
  return signature;
};
```

### WebSocket Events

```typescript
socket.on("gameUpdate", (data: GameState) => {
  dispatch(updateGameState(data));
});

socket.on("turnUpdate", (data: TurnData) => {
  dispatch(updateTurn(data));
});

socket.emit("makeMove", {
  gameId,
  moveId,
  moveType,
});
```

## Styling

Using MUI theme customization:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});
```

## Error Handling

Global error boundary and toast notifications:

```typescript
const ErrorBoundary: React.FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return children;
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Run tests:

```bash
yarn test
# or
npm test
```

## Build

Create production build:

```bash
yarn build
# or
npm run build
```

## License

This project is licensed under the MIT License.
