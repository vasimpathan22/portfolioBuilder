import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomeWithNavigation,
  EditPortfolioWithNavigation,
  PreviewPortfolioWithNavigation,
} from "../components";
import Home1WithNavigation from "../components/Home1";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeWithNavigation />} />
        <Route path="/edit" element={<EditPortfolioWithNavigation />} />
        <Route path="/preview" element={<PreviewPortfolioWithNavigation />} />
        <Route path="/create" element={<EditPortfolioWithNavigation />} />
        <Route path="/home" element={<Home1WithNavigation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
