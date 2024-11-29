import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import PreviewPortfolio from "../components/PreviewPortfolio";
import EditPortfolio from "../components/EditPortfolio";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<EditPortfolio />} />
        <Route path="/preview" element={<PreviewPortfolio />} />
        <Route path="/create" element={<EditPortfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
