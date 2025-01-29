import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Layout } from "../UI/Layout";
import { Auth } from "../pages/Auth";
import { FAQ } from "../pages/FAQ";
import { Journal } from "../pages/Journal";
import { Feed } from "../pages/Feed";
import { Profile } from "../pages/Profile";

export const routes = (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      {/* Route for about page */}
      <Route path="about" element={<About />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="journal" element={<Journal />} />
      <Route path="feed" element={<Feed />} />
      <Route path="profile" element={<Profile />} />
    </Route>

    {/* Route for login page */}
    <Route path="/login" element={<Auth />} />
  </Routes>
);
