import { FC } from "react";
import { BrowserRouter } from "react-router-dom";

export const withRouter = (Component: FC) => () => {
  return (
    <BrowserRouter>
      <Component />
    </BrowserRouter>
  );
};
