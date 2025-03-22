import { withProviders } from "./providers";
import { Routing } from "@/pages";

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Routing />
    </div>
  );
}

export default withProviders(App);
