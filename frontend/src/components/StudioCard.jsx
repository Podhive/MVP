import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Mic, BadgeCheck } from "lucide-react";

const StudioCard = ({ studio, isMasked }) => {
  const { _id, name, images, location, ratingSummary } = studio;

  const pricePerHour = studio.pricePerHour;

  const renderStars = () => {
    const stars = [];
    const rating = ratingSummary?.average || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={
            i <= rating
              ? "h-4 w-4 fill-yellow-400 text-yellow-400"
              : "h-4 w-4 text-gray-300"
          }
        />
      );
    }
    return stars;
  };

  // Helper function to determine the category badge
  const getCategoryBadge = (price) => {
    if (price === null || price === undefined || price === Infinity) {
      return null;
    }
    if (price < 2000) {
      return { text: "Budget", className: "bg-blue-500" };
    }
    if (price >= 2000 && price < 4000) {
      return { text: "Elite", className: "bg-purple-600" };
    }
    if (price >= 4000) {
      return { text: "Premium", className: "bg-amber-500" };
    }
    return null;
  };

  const categoryBadge = getCategoryBadge(pricePerHour);

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

        {/* --- BADGES --- */}
        {/* Verified Badge */}
        <div
          className="absolute top-2 left-2 flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 shadow-sm"
          title="Verified Studio"
        >
          <BadgeCheck className="h-4 w-4 mr-1" />
          Verified
        </div>

        {/* Category Badge */}
        {categoryBadge && (
          <div
            className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold text-white z-10 shadow-sm ${categoryBadge.className}`}
          >
            {categoryBadge.text}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-1 group-hover:text-indigo-900 transition-colors">
          {name}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-indigo-900" />
          <span className="text-sm">
            {isMasked
              ? "Location revealed after booking"
              : location?.city || "Location not specified"}
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
          <div className="text-indigo-900 font-semibold text-lg">
            {pricePerHour !== Infinity
              ? `₹${pricePerHour}/session`
              : "Price not available"}
          </div>
          <Link
            to={`/studios/${_id}`}
            className="px-4 py-2 bg-indigo-900 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
