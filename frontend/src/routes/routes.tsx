import { Routes, Route } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
    </Routes>
  );
};
