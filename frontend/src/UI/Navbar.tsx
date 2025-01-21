import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";

export const Navbar = () => (
  <nav className="flex items-center justify-between p-4">
    <Logo />
    <ThemeToggle />
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
