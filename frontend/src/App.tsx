import { useEffect } from "react";
import { routes } from "./routes/routes";

import { useThemeStore } from "./store/useThemeStore";

import { Home } from "./pages/Home";
import { BrowserRouter, Routes } from "react-router-dom";

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
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};
