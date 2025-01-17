import { Logo } from "../components/Logo";

export const Navbar = () => (
  <nav className="flex items-center justify-between p-4">
    <Logo />
    <div className="flex items-center space-x-4">
      <a
        href="/about"
        className="text-text-light dark:text-text-dark font-medium hover:underline"
      >
        About
      </a>
      <a
        href="/login"
        className="text-text-light dark:text-text-dark font-medium hover:underline"
      >
        Login
      </a>
    </div>
  </nav>
);
