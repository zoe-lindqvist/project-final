import { HeroSection } from "../components/HeroSection";
import { Carousel } from "../components/Carousel";
import { HowItWorks } from "../components/HowItWorks";
import { Community } from "../components/Community";

export const Home: React.FC = () => {
  const albums = [
    {
      title: "Renaissance",
      artist: "Beyoncé",
      cover:
        "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?w=300&h=300&fit=crop",
    },
    {
      title: "Midnights",
      artist: "Taylor Swift",
      cover:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    },
    {
      title: "30",
      artist: "Adele",
      cover:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
    },
    {
      title: "Harry's House",
      artist: "Harry Styles",
      cover:
        "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop",
    },
    {
      title: "Un Verano Sin Ti",
      artist: "Bad Bunny",
      cover:
        "https://images.unsplash.com/photo-1598387300105-ec5ae2ed9995?w=300&h=300&fit=crop",
    },
    {
      title: "Planet Her",
      artist: "Doja Cat",
      cover:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=300&h=300&fit=crop",
    },
    {
      title: "Honestly, Nevermind",
      artist: "Drake",
      cover:
        "https://images.unsplash.com/photo-1598387181366-6dcb1a56a2e1?w=300&h=300&fit=crop",
    },
    {
      title: "Special",
      artist: "Lizzo",
      cover:
        "https://images.unsplash.com/photo-1598387300454-6aa1a597c716?w=300&h=300&fit=crop",
    },
    {
      title: "Motomami",
      artist: "Rosalía",
      cover:
        "https://images.unsplash.com/photo-1598387181245-a6f43e3a2f96?w=300&h=300&fit=crop",
    },
    {
      title: "Dance Fever",
      artist: "Florence + The Machine",
      cover:
        "https://images.unsplash.com/photo-1598387181584-e86c5a8b8c6e?w=300&h=300&fit=crop",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* ...Hero Section Content... */}
        <HeroSection />
      </section>

      {/* Carousel Section */}
      <section className="py-16 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Top 10 Mood Picks
        </h2>
        <Carousel items={albums} />
      </section>

      {/* Features Section */}
      <section className="py-24">
        {/* ...Features Section Content... */}
        <HowItWorks />
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-3xl">
        {/* ...Stats Section Content... */}
        <Community />
      </section>
    </div>
  );
};
