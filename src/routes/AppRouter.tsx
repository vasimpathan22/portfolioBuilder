import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomeWithNavigation,
  EditPortfolioWithNavigation,
  PreviewPortfolioWithNavigation,
} from "../components";

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
