import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";

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
    <>
      <h1>Mood Melody</h1>
    </>
  );
};
