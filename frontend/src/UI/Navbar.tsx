import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, Menu, X, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/about">About</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/journal">Journal</NavLink>
                <NavLink to="/feed">Feed</NavLink>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="relative group"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                    aria-label="Toggle profile menu"
                  >
                    <UserCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 border border-gray-100 dark:border-gray-700"
                      role="menu"
                      aria-label="User Profile Menu"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                        aria-label="Log out of your account"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg"
            role="menu"
            aria-label="Mobile Navigation Menu"
          >
            <div className="flex flex-col p-4 space-y-4">
              <MobileNavLink to="/about">About</MobileNavLink>
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/journal">Journal</MobileNavLink>
                  <MobileNavLink to="/feed">Feed</MobileNavLink>
                  <MobileNavLink to="/profile">Profile</MobileNavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-red-600 dark:text-red-400"
                    role="menuitem"
                    aria-label="Log out of your account"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative font-medium transition-colors duration-300 ${
        isActive
          ? "text-purple-600 dark:text-purple-400"
          : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
      }`}
      role="menuitem"
    >
      {children}
      <div
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transform origin-left transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium ${
        isActive
          ? "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
      role="menuitem"
    >
      {children}
    </Link>
  );
};
