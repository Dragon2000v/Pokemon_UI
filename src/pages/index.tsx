import { Routes, Route } from "react-router-dom";
import { HomePage } from "./home";
import { GamePage } from "./game";
import { Layout } from "../widgets/layout";

export const Routing = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Route>
    </Routes>
  );
};
