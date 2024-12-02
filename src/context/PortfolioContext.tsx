/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { Portfolio } from "../types/types";
import portfolioService from "../service/portfolioService";

type childrenProp = {
  children: React.ReactNode;
};

export type portfolioContextType = {
  portfolio: Portfolio | null;
  setPortfolio: React.Dispatch<React.SetStateAction<Portfolio | null>>;
  updatePortfolio: (newPortfolio: Portfolio) => void;
};

export const PortfolioContext = createContext<portfolioContextType | null>(
  null
);

export const PortfolioProvider = ({ children }: childrenProp) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(
    portfolioService.getLocalStoragePortfolio()
  );

  const updatePortfolio = (newPortfolio: Portfolio) => {
    setPortfolio(newPortfolio);
    portfolioService.savePortfolioToLocalStorage(newPortfolio);
  };

  return (
    <PortfolioContext.Provider
      value={{ portfolio, setPortfolio, updatePortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
