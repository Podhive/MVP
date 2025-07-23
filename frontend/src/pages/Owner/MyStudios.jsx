import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchStudios, deleteStudio } from "../../api";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { Edit, Trash, Star, MapPin, Plus, Mic } from "lucide-react";
import useAuth from "../../context/useAuth";

const MyStudios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStudios = async () => {
      try {
        const response = await fetchStudios();
        console.log("All studios:", response.data);
        console.log("Current user ID:", user?._id);

        // Filter studios owned by the current user - check both author field and author._id
        const myStudios = response.data.filter((studio) => {
          const authorId =
            typeof studio.author === "object"
              ? studio.author._id
              : studio.author;
          return authorId === user?._id;
        });

        console.log("My studios:", myStudios);
        setStudios(myStudios);
      } catch (error) {
        console.error("Error fetching studios:", error);
        setError("Failed to load your studios. Please try again later.");
        toast.error("Failed to load studios");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      getStudios();
    }
  }, [user]);

  const handleDeleteStudio = async (studioId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this studio? This action cannot be undone."
      )
    ) {
      try {
        await deleteStudio(studioId);
        setStudios(studios.filter((studio) => studio._id !== studioId));
        toast.success("Studio deleted successfully");
      } catch (error) {
        console.error("Error deleting studio:", error);
        toast.error(error.response?.data?.message || "Failed to delete studio");
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= (rating || 0)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              My Studios
            </h1>
            <p className="text-gray-600 mt-1">Manage your podcast studios</p>
          </div>
          <Link
            to="/owner/studios/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Studio
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : studios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {studio.images && studio.images.length > 0 ? (
                    <img
                      src={studio.images[0]}
                      alt={studio.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Mic className="h-12 w-12 text-indigo-400" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                      {studio.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        studio.approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {studio.approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center mb-3 text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">
                      {studio.location?.city || "Location not specified"}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(studio.ratingSummary?.average)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({studio.ratingSummary?.count || 0} reviews)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-indigo-600 font-semibold">
                      ₹{studio.pricePerHour}/hour
                    </div>

                    <div className="flex space-x-2">
                      {studio.approved && (
                        <button
                          onClick={() =>
                            navigate(`/owner/studios/${studio._id}/edit`)
                          }
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Studio"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteStudio(studio._id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Studio"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-200">
            <div className="mb-6">
              <Mic className="h-16 w-16 mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              No Studios Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't added any studios yet. Create your first studio to
              start receiving bookings and grow your business!
            </p>
            <Link
              to="/owner/studios/new"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Studio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudios;
