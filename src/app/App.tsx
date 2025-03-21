import { BrowserRouter } from "react-router-dom";
import { Routing } from "../pages";
import { withProviders } from "./providers";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-text">
        <Routing />
      </div>
    </BrowserRouter>
  );
}

export default withProviders(App);
