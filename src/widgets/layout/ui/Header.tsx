import { FC } from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "@/entities/web3";
import { Button } from "@/shared/ui/button";

export const Header: FC = () => {
  const { connect, disconnect, signer } = useWeb3();

  return (
    <header className="bg-surface py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Pokemon Battle
        </Link>
        <Button onClick={signer ? disconnect : connect} variant="secondary">
          {signer ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
      </div>
    </header>
  );
};
