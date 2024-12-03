import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import { Location, NavigateFunction } from "react-router-dom";

type HomeProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

class Home extends Component<HomeProps> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;

  constructor(props: HomeProps) {
    super(props);
    this.handleViewPortfolio = this.handleViewPortfolio.bind(this);
    this.handleCreatePortfolio = this.handleCreatePortfolio.bind(this);
  }

  handleViewPortfolio = () => {
    this.props.navigate?.("/preview");
  };

  handleCreatePortfolio = () => {
    this.props.navigate?.("/create");
  };

  render() {
    const { portfolio } = this.context;
    const isPortfolioCreatedAlready = portfolio?.about?.name;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-2xl p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
            Welcome to Portfolio Builder
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {isPortfolioCreatedAlready
              ? "Your portfolio is ready to view."
              : "Create a stunning portfolio in minutes!"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={
                isPortfolioCreatedAlready
                  ? this.handleViewPortfolio
                  : this.handleCreatePortfolio
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-md transition duration-300"
            >
              {isPortfolioCreatedAlready
                ? "View Portfolio"
                : "Create Portfolio"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const HomeWithNavigation = WithNavigation(Home);
export default HomeWithNavigation;
