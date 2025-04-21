import { useNavigate } from "react-router-dom";
import { surrender } from "../api/gameActions";
import { Loader } from "@/shared/ui/loader";
import { useState } from "react";
import { FaUser, FaRobot } from "react-icons/fa";

const navigate = useNavigate();

const [isSurrendering, setIsSurrendering] = useState(false);

const handleSurrender = async () => {
  try {
    setIsSurrendering(true);
    const updatedGame = await surrender(gameId);
    setGameState(updatedGame);
    setTimeout(() => {
      setIsSurrendering(false);
      navigate("/pokemon-select");
    }, 500);
  } catch (error) {
    console.error("Error surrendering:", error);
    setIsSurrendering(false);
  }
};

return (
  <div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-4">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg ${
          gameState?.currentTurn === "player"
            ? "bg-green-500/20 ring-2 ring-green-500"
            : "bg-gray-500/20"
        }`}
      >
        <FaUser className="text-2xl" />
        <span>Player</span>
      </div>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg ${
          gameState?.currentTurn === "computer"
            ? "bg-green-500/20 ring-2 ring-green-500"
            : "bg-gray-500/20"
        }`}
      >
        <span>Computer</span>
        <FaRobot className="text-2xl" />
      </div>
    </div>

    {/* Game content */}
    {isSurrendering && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Loader size="lg" />
      </div>
    )}

    {/* Rest of your existing JSX */}
  </div>
);
