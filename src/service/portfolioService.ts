import { Portfolio } from "../types/types";

class PortfolioService {
  constructor() {}

  getLocalStoragePortfolio(): Portfolio {
    const savedPortfolio = localStorage.getItem("portfolio");
    if (savedPortfolio) {
      return JSON.parse(savedPortfolio);
    }
    return {
      about: { description: "", name: "", tagline: "" },
      skills: [],
      projects: [],
      experiences: [],
      contact: {
        email: "",
        phone: "",
        socials: {
          LinkedIn: "",
          GitHub: "",
        },
      },
    };
  }

  savePortfolioToLocalStorage(portfolio: Portfolio) {
    const savedPortfolios = this.getAllPortfolios();
    const portfolioIndex = localStorage.getItem("currentPortfolioIndex");
    if (portfolioIndex) {
      savedPortfolios[+portfolioIndex] = portfolio;
      console.log(`Updated the portfolio at index ${portfolioIndex}`);
    } else {
      savedPortfolios.push(portfolio);
      const savedPortfoliosLength = savedPortfolios.length - 1;
      localStorage.setItem(
        "currentPortfolioIndex",
        savedPortfoliosLength.toString()
      );
      console.log("saved new portfolio");
    }
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    localStorage.setItem("portfolios", JSON.stringify(savedPortfolios));
  }

  resetPortfolio(): Portfolio {
    const newPortfolio: Portfolio = {
      about: { description: "", name: "", tagline: "" },
      skills: [],
      projects: [],
      experiences: [],
      contact: {
        email: "",
        phone: "",
        socials: {
          LinkedIn: "",
          GitHub: "",
        },
      },
    };
    localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
    return newPortfolio;
  }

  getAllPortfolios(): Portfolio[] {
    const savedPortfolios = localStorage.getItem("portfolios");
    if (savedPortfolios) {
      return JSON.parse(savedPortfolios);
    }
    return [];
  }

  deletePortfolio(index: number) {
    const savedPortfolios = this.getAllPortfolios();
    savedPortfolios.splice(index, 1);
    localStorage.setItem("portfolios", JSON.stringify(savedPortfolios));
    localStorage.removeItem("currentPortfolioIndex");
    localStorage.removeItem("portfolio");
    console.log(`Deleted the portfolio at index ${index}`);
  }
}

const portfolioService = new PortfolioService();
export default portfolioService;
