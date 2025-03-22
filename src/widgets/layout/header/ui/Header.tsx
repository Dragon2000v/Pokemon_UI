import { FC } from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "@/entities/web3";
import { Button } from "@/shared/ui/button";

export const Header: FC = () => {
  const { signer, connect } = useWeb3();

  return (
    <header className="bg-background/50 backdrop-blur-sm border-b border-text/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Pokemon Battle
          </Link>
          <Button onClick={connect} variant="outline" size="sm">
            {signer ? "Кошелек подключен" : "Подключить кошелек"}
          </Button>
        </div>
      </div>
    </header>
  );
};
