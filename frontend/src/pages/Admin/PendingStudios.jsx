import React, { useState, useEffect } from "react";
import { getPendingStudios, approveStudio, denyStudio } from "../../api";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import {
  CheckCircle,
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  Camera,
  Clock,
  Package,
} from "lucide-react";
import { format } from "date-fns";

const PendingStudios = () => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingStudio, setProcessingStudio] = useState(null);

  useEffect(() => {
    const fetchPendingStudios = async () => {
      try {
        const response = await getPendingStudios();
        setStudios(response.data);
      } catch (error) {
        console.error("Error fetching pending studios:", error);
        setError("Failed to load pending studios. Please try again later.");
        toast.error("Failed to load pending studios");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStudios();
  }, []);

  const handleApproveStudio = async (studioId) => {
    setProcessingStudio(studioId);
    try {
      await approveStudio(studioId);
      setStudios(studios.filter((studio) => studio._id !== studioId));
      toast.success("Studio approved successfully");
    } catch (error) {
      console.error("Error approving studio:", error);
      toast.error(error.response?.data?.message || "Failed to approve studio");
    } finally {
      setProcessingStudio(null);
    }
  };

  const handleDenyStudio = async (studioId) => {
    if (
      window.confirm(
        "Are you sure you want to deny this studio? This action cannot be undone."
      )
    ) {
      setProcessingStudio(studioId);
      try {
        await denyStudio(studioId);
        setStudios(studios.filter((studio) => studio._id !== studioId));
        toast.success("Studio denied and removed successfully");
      } catch (error) {
        console.error("Error denying studio:", error);
        toast.error(error.response?.data?.message || "Failed to deny studio");
      } finally {
        setProcessingStudio(null);
      }
    }
  };

  const formatOperationalHours = (operationalHours) => {
    if (!operationalHours) return "Not specified";

    const formatTime = (time) => {
      // FIX: Handles numeric time values (e.g., 9) by converting them to "09:00"
      if (typeof time === "number") {
        time = `${time.toString().padStart(2, "0")}:00`;
      } else if (!time || typeof time !== "string" || !time.includes(":")) {
        return "Invalid time";
      }

      const [hour, minute] = time.split(":");
      const hourNum = parseInt(hour, 10);
      const period = hourNum >= 12 ? "PM" : "AM";
      const displayHour =
        hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${displayHour}:${minute} ${period}`;
    };

    // Handle different possible property names from backend
    const startTime =
      operationalHours.start_time ||
      operationalHours.start ||
      operationalHours.startTime;
    const endTime =
      operationalHours.end_time ||
      operationalHours.end ||
      operationalHours.endTime;

    if (!startTime || !endTime) {
      return "Not specified";
    }

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const getPackageName = (key) => {
    switch (key) {
      case "1cam":
        return "1 Camera Setup";
      case "2cam":
        return "2 Camera Setup";
      case "3cam":
        return "3 Camera Setup";
      default:
        return key;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Pending Studio Approvals
          </h1>
          <span className="ml-3 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            Admin Panel
          </span>
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
          <div className="space-y-6">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="lg:flex">
                  <div className="lg:w-1/3 h-48 lg:h-auto">
                    {studio.images && studio.images.length > 0 ? (
                      <img
                        src={studio.images[0]}
                        alt={studio.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-gray-400">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 lg:w-2/3">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">
                          {studio.name}
                        </h2>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>
                            {studio.location?.city}, {studio.location?.state}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Submitted on{" "}
                            {format(new Date(studio.createdAt), "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            Hours:{" "}
                            {formatOperationalHours(studio.operationalHours)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveStudio(studio._id)}
                          disabled={processingStudio === studio._id}
                          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingStudio === studio._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </button>

                        <button
                          onClick={() => handleDenyStudio(studio._id)}
                          disabled={processingStudio === studio._id}
                          className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingStudio === studio._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          ) : (
                            <X className="h-4 w-4 mr-2" />
                          )}
                          Deny
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {studio.description}
                      </p>
                    </div>

                    {/* Base Price */}
                    {studio.pricePerHour && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Base Hourly Rate
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-900 font-semibold">
                            ₹{studio.pricePerHour}/hour
                          </p>
                          <p className="text-xs text-gray-500">
                            Studio operational base rate
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Camera Packages */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Camera className="h-4 w-4 mr-1" />
                        Camera Packages
                      </h3>
                      {studio.packages && studio.packages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {studio.packages.map((pkg) => (
                            <div
                              key={pkg.key}
                              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-200"
                            >
                              <div className="flex items-center mb-2">
                                <Camera className="h-4 w-4 mr-1 text-indigo-600" />
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {getPackageName(pkg.key)}
                                </h4>
                              </div>
                              <p className="text-lg font-bold text-indigo-600">
                                ₹{pkg.price}
                              </p>
                              <p className="text-xs text-gray-500 mb-1">
                                per hour
                              </p>
                              {pkg.description && (
                                <p className="text-xs text-gray-600">
                                  {pkg.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No packages defined
                        </p>
                      )}
                    </div>

                    {/* Add-on Services */}
                    {studio.addons && studio.addons.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          Add-on Services
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {studio.addons.map((addon, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-2 rounded-lg border border-gray-200"
                            >
                              <h4 className="font-medium text-gray-900 text-sm">
                                {addon.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {addon.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-indigo-600">
                                  ₹{addon.price}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Max: {addon.maxQuantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Equipment */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Equipment
                      </h3>
                      {studio.equipments && studio.equipments.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {studio.equipments.map((equipment, index) => (
                            <span
                              key={index}
                              className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {equipment}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No equipment listed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-200">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              No Pending Studios
            </h2>
            <p className="text-gray-600">
              All studios have been reviewed. Check back later for new
              submissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingStudios;
