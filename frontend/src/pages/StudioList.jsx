import React, { useState, useEffect } from "react";
import { fetchStudios, getReviewsByStudio, getCustomerBookings } from "../api"; // Import getCustomerBookings
import useAuth from "../context/useAuth"; // Import useAuth to check login status
import StudioCard from "../components/StudioCard";
import Navbar from "../components/Navbar";
import { Search, MapPin, Filter, SlidersHorizontal } from "lucide-react";

const StudioList = () => {
  const [studios, setStudios] = useState([]);
  const [filteredStudios, setFilteredStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [bookedStudioIds, setBookedStudioIds] = useState(new Set()); // State for booked studios

  const { isAuthenticated } = useAuth();

  // Effect to fetch user's bookings
  useEffect(() => {
    if (isAuthenticated()) {
      const fetchUserBookings = async () => {
        try {
          const bookingsRes = await getCustomerBookings();
          const ids = new Set(bookingsRes.data.map((b) => b.studio._id));
          setBookedStudioIds(ids);
        } catch (err) {
          console.error("Failed to fetch user bookings:", err);
        }
      };
      fetchUserBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const getStudiosWithRatings = async () => {
      try {
        const response = await fetchStudios();
        const approvedStudios = response.data.filter(
          (studio) => studio.approved
        );

        const studiosWithRatings = await Promise.all(
          approvedStudios.map(async (studio) => {
            try {
              const reviewsRes = await getReviewsByStudio(studio._id);
              const reviews = reviewsRes.data || [];
              const count = reviews.length;
              const average =
                count > 0
                  ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
                  : 0;
              return { ...studio, ratingSummary: { average, count } };
            } catch (err) {
              console.warn(`Failed to fetch reviews for studio ${studio._id}`);
              return { ...studio, ratingSummary: { average: 0, count: 0 } };
            }
          })
        );

        setStudios(studiosWithRatings);
      } catch (error) {
        console.error("Error fetching studios:", error);
        setError("Failed to load studios. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getStudiosWithRatings();
  }, []);

  useEffect(() => {
    if (studios.length > 0) {
      let results = [...studios];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (studio) =>
            studio.name.toLowerCase().includes(term) ||
            (studio.description &&
              studio.description.toLowerCase().includes(term))
        );
      }

      if (cityFilter) {
        results = results.filter(
          (studio) =>
            studio.location?.city?.toLowerCase() === cityFilter.toLowerCase()
        );
      }

      setFilteredStudios(results);
    }
  }, [searchTerm, cityFilter, studios]);

  const cities =
    studios.length > 0
      ? [
          ...new Set(
            studios.map((studio) => studio.location?.city).filter(Boolean)
          ),
        ]
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From recording podcasts to shooting videos, find studios with
            top-quality equipment and acoustics tailored for creators of every
            kind.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by studio name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-full lg:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-colors"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredStudios.length} studio
            {filteredStudios.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
            {cityFilter && ` in ${cityFilter}`}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">
              Oops! Something went wrong
            </h3>
            <p>{error}</p>
          </div>
        ) : filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudios.map((studio, index) => {
              const isBooked = bookedStudioIds.has(studio._id);
              const displayStudio = isBooked
                ? studio
                : {
                    ...studio,
                    name: `Hive Studio ${index + 1}, ${
                      studio.location?.city || "Unknown City"
                    }`,
                  };

              return (
                <StudioCard
                  key={studio._id}
                  studio={displayStudio}
                  isMasked={!isBooked}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <Search className="h-16 w-16 mx-auto text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No studios found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any studios matching your criteria. Try adjusting
              your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCityFilter("");
              }}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioList;
