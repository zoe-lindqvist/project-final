import { Music2 } from "lucide-react";

export const Logo = () => (
  <a href="/" className="flex items-center space-x-2 group">
    {/* Icon container */}
    <div className="relative">
      {/* Glowing effect behind the icon */}
      <div className="absolute inset-0 bg-secondary-light dark:bg-secondary-dark rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />

      {/* Music icon with gradient background */}
      <div className="relative p-3 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full group-hover:scale-110 transition-transform duration-300">
        <Music2 className="h-6 w-6 text-primary-dark dark:text-primary-light" />
      </div>
    </div>

    {/* Text beside the icon */}
    <div>
      <span className="text-xl font-bold text-primary-dark dark:text-primary-light group-hover:scale-105 transition-transform">
        MoodMelody
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Your Emotions in Music
      </span>
    </div>
  </a>
);
