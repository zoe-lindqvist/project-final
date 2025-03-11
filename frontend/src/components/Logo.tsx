import { Music2 } from "lucide-react";

export const Logo = () => (
  <a href="/" className="flex items-center space-x-2 group">
    {/* Ikon container */}
    <div className="relative">
      {/* Glowing effect bakom ikonen */}
      <div className="absolute inset-0 bg-logo-glow-light dark:bg-logo-glow-dark rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      {/* Musikikon med gradientbakgrund */}
      <div className="relative p-3 bg-logo-icon-light dark:bg-logo-icon-dark rounded-full transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[360deg]">
        <Music2 className="h-6 w-6 text-primary-accent dark:text-primary-light" />
      </div>
    </div>

    {/* Text bredvid ikonen */}
    <div className="flex flex-col">
      {/* Huvudtitel med gradienttext och hover-effekt */}
      <span className="text-xl font-bold bg-logo-text-light dark:bg-logo-text-dark text-transparent bg-clip-text transform transition-all duration-300 group-hover:scale-105">
        MoodMelody
      </span>
      {/* Undertitel */}
      <span className="text-xs text-text-light dark:text-text-dark font-medium">
        Your Emotions in Music
      </span>
    </div>
  </a>
);
