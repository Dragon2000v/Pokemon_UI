import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/widgets/layout";
import { HomePage } from "@/pages/home";
import { GamePage } from "@/pages/game";

export const Routing: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="game/:pokemonId" element={<GamePage />} />
      </Route>
    </Routes>
  );
};
