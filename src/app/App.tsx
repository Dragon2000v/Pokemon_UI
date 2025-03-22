import { withProviders } from "./providers";

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-4">
        {/* Здесь будет контент из роутера */}
      </div>
    </div>
  );
}

export default withProviders(App);
