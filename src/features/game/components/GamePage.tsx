import { useNavigate } from "react-router-dom";
import { surrender } from "../api/gameActions";
import { Loader } from "@/shared/ui/loader";
import { useState } from "react";

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
