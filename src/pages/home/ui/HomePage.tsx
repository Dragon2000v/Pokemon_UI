import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/entities/web3";
import { createGame } from "@/features/game";
import { Button } from "@/shared/ui/button";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const { signer, connect } = useWeb3();

  const handleCreateGame = async () => {
    if (!signer) {
      await connect();
      return;
    }

    try {
      const gameId = await createGame();
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Pokemon Battle
        </h1>
        <p className="text-xl mb-8 text-text/80">
          Подключи свой кошелек и начни сражение с покемонами! Брось вызов
          компьютеру в эпической пошаговой битве.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleCreateGame}
            className="w-full max-w-md text-lg"
          >
            {signer ? "Начать новую игру" : "Подключить кошелек"}
          </Button>
          {!signer && (
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
          )}
        </div>
      </div>
    </div>
  );
};
