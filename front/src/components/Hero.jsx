import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Hero = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [currentIndex, interval]);

  return (
    <div className="relative w-full h-[30vh] md:h-[70vh] overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out transform h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => window.open("/productos", "_blank")}
          ></div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center"
        style={{ width: "40px", height: "40px" }}
      >
        <FiChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center"
        style={{ width: "40px", height: "40px" }}
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
};
