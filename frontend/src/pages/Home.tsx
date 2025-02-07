/**
 * **Home Page**
 *
 * Renders the main landing page with:
 * - **Hero Section** (`<HeroSection />`): Introduces the platform.
 * - **Album Carousel** (`<Carousel />`): Scrollable top 10 albums.
 * - **How It Works** (`<HowItWorks />`): Explains platform functionality.
 * - **Community Stats** (`<Community />`): Highlights user engagement.
 *
 * **Accessibility Enhancements**
 * - Uses `aria-labelledby` & `aria-label` for better screen reader support.
 * - Implements `overflow-x-auto` for carousel navigation.
 *
 * **Responsive Design**
 * - Tailwind breakpoints ensure mobile & desktop adaptability.
 */

import { HeroSection } from "../components/HeroSection";
import { Carousel } from "../components/Carousel";
import { HowItWorks } from "../components/HowItWorks";
import { Community } from "../components/Community";

export const Home: React.FC = () => {
  const albums = [
    {
      title: "Renaissance",
      artist: "Beyoncé",
      cover: "/assets/Beyonce.webp",
    },
    {
      title: "Midnights",
      artist: "Taylor Swift",
      cover: "/assets/Swift.webp",
    },
    {
      title: "30",
      artist: "Adele",
      cover: "/assets/Adele.webp",
    },
    {
      title: "Harry's House",
      artist: "Harry Styles",
      cover: "/assets/Harrys-House.webp",
    },
    {
      title: "Utopia",
      artist: "Bad BunnyTravis Scott",
      cover: "/assets/Scott.webp",
    },
    {
      title: "Planet Her",
      artist: "Doja Cat",
      cover: "/assets/Doja-Cat.webp",
    },
    {
      title: "Honestly, Nevermind",
      artist: "Drake",
      cover: "/assets/Drake.webp",
    },
    {
      title: "Special",
      artist: "Lizzo",
      cover: "/assets/Lizzo.webp",
    },
    {
      title: "Motomami",
      artist: "Rosalía",
      cover: "/assets/Rosalia.webp",
    },
    {
      title: "Dance Fever",
      artist: "Florence + The Machine",
      cover: "/assets/Florence.webp",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
      {/* Hero Section */}
      <section
        className="relative py-10 md:py-12 overflow-hidden"
        aria-labelledby="hero-heading"
        aria-describedby="hero-description"
      >
        {/* ...Hero Section Content... */}
        <HeroSection />
      </section>

      {/* Carousel Section */}
      <section
        className="py-10 md:py-8 px-4 md:px-6"
        role="region"
        aria-labelledby="carousel-heading"
        aria-describedby="carousel-description"
      >
        <h2
          id="carousel-heading"
          className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
        >
          Top 10 Mood Picks
        </h2>
        <div
          role="region"
          aria-label="Album carousel"
          className="overflow-x-auto"
        >
          <Carousel items={albums} />
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-10 md:py-10"
        role="region"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="sr-only">
          How MoodMelody Works
        </h2>
        <HowItWorks />
      </section>

      {/* Stats Section*/}
      <section
        className="py-24 md:py-10 mb-12 md:mb-16 from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-3xl"
        aria-labelledby="community-heading"
      >
        {/* ...Stats Section Content... */}
        <Community />
      </section>
    </div>
  );
};
