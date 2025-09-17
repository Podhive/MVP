import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageLightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  // Effect to handle keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
      {/* Main content area */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Image Display */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Studio image ${currentIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Add a simple fadeIn animation to your global CSS (e.g., index.css) if you don't have one */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ImageLightbox;
