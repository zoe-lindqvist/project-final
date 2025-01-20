import { Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Layout } from "../UI/Layout";

export const routes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />

      {/* Route for login page */}

      {/* Route for about page */}

      {/* TODO: Import and Add more routes */}
    </Route>
  </>
);
