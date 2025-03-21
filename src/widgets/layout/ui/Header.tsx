import { FC } from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../../../entities/web3";

export const Header: FC = () => {
  const { connect, disconnect, signer } = useWeb3();

  return (
    <header className="bg-surface py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-text">
          Pokemon Game
        </Link>
        <button
          onClick={signer ? disconnect : connect}
          className="px-4 py-2 bg-primary rounded-lg hover:bg-opacity-80 transition-colors"
        >
          {signer ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
};
