import { Portfolio } from "../types/types";

class PortfolioService {
  constructor() {}

  //this service is used to handle the portfolio regarding operations
  getPortfolio(): Portfolio | null {
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

  savePortfolio(portfolio: Portfolio) {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    console.log("portfolioService::savedPortfolio");
  }
}

const portfolioService = new PortfolioService();
export default portfolioService;
