import { BrowserRouter } from "react-router-dom";
import { Routing } from "@/pages";

export const withRouter = (Component: () => React.ReactNode) => () =>
  (
    <BrowserRouter>
      <Component />
    </BrowserRouter>
  );
