import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  items: { title: string; artist: string; cover: string }[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const nextSlide = () => {
    const maxIndex =
      window.innerWidth >= 768 ? items.length - 4 : items.length - 2;
    setCarouselIndex((prev) => (prev + 1) % maxIndex);
  };

  const prevSlide = () => {
    const maxIndex =
      window.innerWidth >= 768 ? items.length - 4 : items.length - 2;
    setCarouselIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
  };

  return (
    <div className="relative px-8">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-primary-accent text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-primary-dark"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-primary-accent text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 hover:bg-primary-dark"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Content */}
      <div className="overflow-hidden py-8">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${
              carouselIndex * (window.innerWidth >= 768 ? 25 : 50)
            }%)`,
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-[50%] md:min-w-[25%] px-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:scale-110 hover:z-10 relative border border-transparent hover:border-primary-light dark:hover:border-primary-accent">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {item.title}
                </h3>
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
