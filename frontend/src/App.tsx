
import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";

import { Layout } from "./UI/Layout";


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
      {" "}
      <Layout />
      <h1></h1>
    </>
  );
};
