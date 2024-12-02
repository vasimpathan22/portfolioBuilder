import { Portfolio } from "../types/types";

class PortfolioService {
  constructor() {}

  getLocalStoragePortfolio(): Portfolio | null {
    const savedPortfolio = localStorage.getItem("portfolio");
    if (savedPortfolio) {
      return JSON.parse(savedPortfolio);
    }
    return {
      about: { description: "", name: "", tagline: "" },
      skills: [],
      projects: [],
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
}

const portfolioService = new PortfolioService();
export default portfolioService;
