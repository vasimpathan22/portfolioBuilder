import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeWithNavigation from "../components/Home";
import EditPortfolioWithNavigation from "../components/EditPortfolio";
import PreviewPortfolioWithNavigation from "../components/PreviewPortfolio";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeWithNavigation />} />
        <Route path="/edit" element={<EditPortfolioWithNavigation />} />
        <Route path="/preview" element={<PreviewPortfolioWithNavigation />} />
        <Route path="/create" element={<EditPortfolioWithNavigation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
