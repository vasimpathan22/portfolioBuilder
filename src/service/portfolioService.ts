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
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    console.log("portfolioService::savedPortfolio");
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
}

const portfolioService = new PortfolioService();
export default portfolioService;
