import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Definierar interface för props som skickas till Carousel-komponenten
interface CarouselProps {
  // Array med objekt som representerar varje objekt i karusellen
  items: { title: string; artist: string; cover: string }[];
}
// Carousel-komponenten tar emot items som props och returnerar en karusell med dessa
export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  // State för att hålla koll på vilket index som visas i karusellen
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Funktion för att visa nästa bild i karusellen
  const nextSlide = () => {
    // Bestämmer maxvärdet för index beroende på skärmbredd
    const maxIndex =
      window.innerWidth >= 768 ? items.length - 4 : items.length - 2;

    // Uppdaterar index i karusellen cykliskt (börjar om från start när slutet nås)
    setCarouselIndex((prev) => (prev + 1) % maxIndex);
  };

  // Funktion för att visa föregående bild i karusellen
  const prevSlide = () => {
    const maxIndex =
      window.innerWidth >= 768 ? items.length - 4 : items.length - 2;
    setCarouselIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
  };

  // Returnerar karusell-komponenten
  return (
    <div className="relative px-8">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute -left-0 md:left-3 top-1/2 -translate-y-1/2 z-20 bg-primary-accent text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-primary-dark"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute -right-0 md:right-3 top-1/2 -translate-y-1/2 z-20 bg-primary-accent text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-primary-dark"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Karusell innehåll */}
      <div className="overflow-hidden py-8">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            // Flyttar containern åt vänster baserat på aktuell indexposition
            transform: `translateX(-${
              carouselIndex * (window.innerWidth >= 768 ? 25 : 100)
            }%)`,
          }}
        >
          {/* Loopar genom items-arrayen och skapar individuella slides */}
          {items.map((item, index) => (
            <div
              key={index}
              className="min-w-full sm:min-w-[50%] md:min-w-[25%] px-4"
            >
              {/* Individuellt kort i karusellen */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:scale-110 hover:z-10 relative border border-transparent hover:border-primary-light dark:hover:border-primary-accent">
                {/* Bild, titel och artist */}
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                {/* Albumtitel */}
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {item.title}
                </h3>
                {/* Artistnamn */}
                <p className="text-text-light dark:text-text-dark truncate">
                  {item.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
