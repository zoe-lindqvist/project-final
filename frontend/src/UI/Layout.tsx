import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-20">{<Outlet />}</main>
      {/* <Footer /> */}
    </div>
  );
};
