import { PortfolioProvider } from "./context/PortfolioContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <PortfolioProvider>
      <AppRouter />
    </PortfolioProvider>
  );
}

export default App;
