import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-primary-light dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      {/* <Footer /> */}
      <Footer />
    </div>
  );
};
