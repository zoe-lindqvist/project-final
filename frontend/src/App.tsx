import { useEffect } from "react";
import { AppRoutes } from "./routes/routes";

import { useThemeStore } from "./store/useThemeStore";

import { Layout } from "./UI/Layout";

import { HeroSection } from "./components/HeroSection";
import { BrowserRouter } from "react-router-dom";

export const App = () => {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <Layout />
      <HeroSection />
      <h1></h1>
    </BrowserRouter>
  );
};
