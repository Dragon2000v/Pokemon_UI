import { BrowserRouter } from "react-router-dom";
import { Routing } from "@/pages";

export const withRouter = (component: () => React.ReactNode) => () =>
  (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
