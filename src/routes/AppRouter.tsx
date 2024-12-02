import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreviewPortfolioClass from "../components/PreviewPortfolioClass";
import EditPortfolioClass from "../components/EditPortfolioClass";
import HomeClass from "../components/HomeClass";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeClass />} />
        <Route path="/edit" element={<EditPortfolioClass />} />
        <Route path="/preview" element={<PreviewPortfolioClass />} />
        <Route path="/create" element={<EditPortfolioClass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
