import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";

function Home() {
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();

  const handleViewPortfolio = () => {
    navigate("/preview");
  };

  const handleCreatePortfolio = () => {
    navigate("/create");
  };

  // Check if the portfolio is already created
  const isPortfolioCreated = portfolio?.about?.name;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Welcome to Portfolio Builder
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {isPortfolioCreated
            ? "Your portfolio is ready to view."
            : "Create a stunning portfolio in minutes!"}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={
              isPortfolioCreated ? handleViewPortfolio : handleCreatePortfolio
            }
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-md transition duration-300"
          >
            {isPortfolioCreated ? "View Portfolio" : "Create Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
