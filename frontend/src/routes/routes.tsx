import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Layout } from "../UI/Layout";
import { Auth } from "../pages/Auth";

export const routes = (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      {/* Route for about page */}
      <Route path="about" element={<About />} /> {/* Add the About route */}
      {/* TODO: Import and Add more routes */}
    </Route>

    {/* Route for login page */}
    <Route path="/login" element={<Auth />} />
  </Routes>
);
