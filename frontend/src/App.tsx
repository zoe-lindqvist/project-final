import { useEffect } from "react";
import { routes } from "./routes/routes";
import { useThemeStore } from "./store/useThemeStore";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

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
      <ScrollToTop />
      {routes}
    </BrowserRouter>
  );
};
