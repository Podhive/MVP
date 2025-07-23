import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Mic } from "lucide-react";

const StudioCard = ({ studio }) => {
  const { _id, name, images, location, ratingSummary } = studio;

  // Get the lowest price from pricing
  const pricePerHour = studio.pricePerHour;

  // Render stars based on average rating
  const renderStars = () => {
    const stars = [];
    const rating = ratingSummary?.average || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="h-48 overflow-hidden relative">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Mic className="h-12 w-12 text-indigo-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
          <span className="text-sm">
            {location?.city || "Location not specified"}
          </span>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex mr-2">{renderStars()}</div>
          <span className="text-sm text-gray-600">
            {ratingSummary?.average ? ratingSummary.average.toFixed(1) : "0.0"}{" "}
            ({ratingSummary?.count || 0})
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-indigo-600 font-semibold text-lg">
            {pricePerHour !== Infinity
              ? `₹${pricePerHour}/session`
              : "Price not available"}
          </div>
          <Link
            to={`/studios/${_id}`}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
