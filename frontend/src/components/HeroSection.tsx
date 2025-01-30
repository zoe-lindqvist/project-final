import { Link } from "react-router-dom";
import { Music2 } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-logo-glow-light dark:bg-logo-glow-dark rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-logo-glow-light dark:bg-logo-glow-dark rounded-full blur-3xl -z-10" />

      <div className="text-center relative">
        <div className="inline-block animate-bounce-slow mb-8">
          <div className="bg-logo-icon-light dark:bg-logo-icon-dark p-4 rounded-full">
            <Music2 className="h-12 w-12 text-purple-600  dark:text-primary-light" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Your Emotions,
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-transparent bg-clip-text">
            Transformed into Music
          </span>
        </h1>
        <p className="text-xl text-text-light dark:text-text-dark mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience a new way to connect with music through your emotions. Let
          AI turn your feelings into the perfect soundtrack for your day.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/login"
            className="bg-primary-accent dark:bg-primary-default text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-dark dark:hover-bg-primary-accent transition-all hover:scale-105 shadow-lg hover:shadow-primary-accent/25"
          >
            Start Your Journey
          </Link>
          <Link
            to="/about"
            className="text-text-light dark:text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border-2 border-gray-200 dark:border-gray-700"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};
