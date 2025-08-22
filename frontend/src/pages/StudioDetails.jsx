import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchStudios,
  getAvailableSlots,
  getReviewsByStudio,
  createReview,
  updateReview,
  deleteReview,
} from "../api";
import Navbar from "../components/Navbar";
import StudioCarousel from "../components/StudioCarousel";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import useAuth from "../context/useAuth";
import {
  Star,
  MapPin,
  Package,
  Clock,
  Edit,
  Camera,
  Wrench,
  Info,
  Instagram,
  Youtube,
} from "lucide-react";

const StudioDetails = () => {
  const { studioId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useAuth();

  const [studio, setStudio] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Utility function to compute and set rating summary on studio
  const updateRatingSummary = (reviewList) => {
    const totalRatings = reviewList.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const reviewCount = reviewList.length;
    const averageRating = reviewCount ? totalRatings / reviewCount : 0;

    setStudio((prevStudio) =>
      prevStudio
        ? {
            ...prevStudio,
            ratingSummary: {
              average: averageRating,
              count: reviewCount,
            },
          }
        : null
    );
  };

  useEffect(() => {
    const fetchStudioData = async () => {
      try {
        const studiosResponse = await fetchStudios();
        const foundStudio = studiosResponse.data.find(
          (s) => s._id === studioId
        );
        if (!foundStudio) {
          setError("Studio not found");
          return;
        }

        setStudio(foundStudio);

        if (isAuthenticated()) {
          const availabilityResponse = await getAvailableSlots(studioId);
          setAvailableSlots(availabilityResponse.data);
        }

        const reviewsResponse = await getReviewsByStudio(studioId);
        const fetchedReviews = reviewsResponse.data;
        setReviews(fetchedReviews);
        updateRatingSummary(fetchedReviews);

        if (
          user &&
          fetchedReviews.some((review) => review.reviewer?._id === user._id)
        ) {
          setUserHasReviewed(true);
        }
      } catch (error) {
        console.error("Error fetching studio details:", error);
        setError("Failed to load studio details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudioData();
  }, [studioId, isAuthenticated, user]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingComplete = () => {
    setSelectedSlot(null);
    navigate("/bookings/customer");
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (editingReview) {
        await updateReview(editingReview._id, {
          rating: reviewData.rating,
          description: reviewData.description,
        });
        toast.success("Review updated successfully");
      } else {
        await createReview(reviewData);
        toast.success("Review submitted successfully");
      }

      const reviewsResponse = await getReviewsByStudio(studioId);
      const updatedReviews = reviewsResponse.data;
      setReviews(updatedReviews);
      updateRatingSummary(updatedReviews);

      setShowReviewForm(false);
      setEditingReview(null);
      setUserHasReviewed(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        toast.success("Review deleted successfully");

        const reviewsResponse = await getReviewsByStudio(studioId);
        const updatedReviews = reviewsResponse.data;
        setReviews(updatedReviews);
        updateRatingSummary(updatedReviews);

        setUserHasReviewed(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete review");
      }
    }
  };

  const isStudioOwner =
    studio &&
    user &&
    (typeof studio.author === "object" ? studio.author._id : studio.author) ===
      user._id;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i <= (rating || 0)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const formatOperationalHours = (operationalHours) => {
    if (!operationalHours) return "Not specified";

    const formatTime = (time) => {
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

    return `${formatTime(operationalHours.start)} - ${formatTime(
      operationalHours.end
    )}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error || "Studio not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Studio Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
            {studio.name}
          </h1>

          <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
              <span className="text-sm lg:text-base">
                {studio.location?.fullAddress}, {studio.location?.city},{" "}
                {studio.location?.state} {studio.location?.pinCode}
              </span>
            </div>

            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {renderStars(studio.ratingSummary?.average)}
              </div>
              <span className="text-sm lg:text-base">
                {studio.ratingSummary?.average
                  ? studio.ratingSummary.average.toFixed(1)
                  : "0.0"}{" "}
                ({studio.ratingSummary?.count || 0} reviews)
              </span>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-600" />
              <span className="text-sm lg:text-base">
                {formatOperationalHours(studio.operationalHours)}
              </span>
            </div>

            {studio.instagramUsername && (
              <div className="flex items-center">
                <Instagram className="h-5 w-5 mr-2 text-indigo-600" />
                <a
                  href={`https://www.instagram.com/${studio.instagramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm lg:text-base text-indigo-700 hover:underline"
                >
                  @{studio.instagramUsername}
                </a>
              </div>
            )}
          </div>

          {isStudioOwner && (
            <div className="mb-4">
              <button
                onClick={() => navigate(`/owner/studios/${studioId}/edit`)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Studio
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {/* Studio Images */}
            <div className="mb-8">
              <StudioCarousel images={studio.images} />
            </div>

            {/* Studio Description */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                About This Studio
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                {studio.description}
              </p>

              <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-indigo-600" />
                Equipment
              </h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {studio.equipments &&
                  studio.equipments.map((equipment, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {equipment}
                    </span>
                  ))}
              </div>

              <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-indigo-600" />
                Camera Packages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studio.packages &&
                  studio.packages.map((pkg) => (
                    <div
                      key={pkg.key}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200"
                    >
                      <div className="flex items-center mb-3">
                        <Camera className="h-5 w-5 mr-2 text-indigo-600" />
                        <span className="font-medium text-gray-900">
                          {pkg.key === "1 Cam"
                            ? "1 Camera"
                            : pkg.key === "2 Cam"
                            ? "2 Cameras"
                            : "3 Cameras"}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        ₹{pkg.price}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">per hour</p>
                      <p className="text-sm text-gray-700">{pkg.description}</p>
                    </div>
                  ))}
              </div>

              {studio.addons && studio.addons.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mb-4 mt-8 text-gray-900 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-indigo-600" />
                    Add-on Services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studio.addons.map((addon) => (
                      <div
                        key={addon.key}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <h4 className="font-medium text-gray-900">
                          {addon.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {addon.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold text-indigo-600">
                            ₹{addon.price}
                          </span>
                          <span className="text-xs text-gray-500">
                            Max: {addon.maxQuantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Cancellation Policy */}
              <h3 className="text-lg font-medium mb-4 mt-8 text-gray-900 flex items-center">
                <Info className="h-5 w-5 mr-2 text-indigo-600" />
                Cancellation Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Cancellation or changes in booking is possible through demand,
                visit contact us page and pull up the request.
              </p>
            </div>

            {/* YouTube Showcase Section */}
            {studio.youtubeLinks && studio.youtubeLinks.length > 0 && (
              <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                  <Youtube className="h-6 w-6 mr-3 text-red-600" />
                  Studio Showcase
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {studio.youtubeLinks.map((link, index) => (
                    <div
                      key={index}
                      className="relative h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-md"
                    >
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={link}
                        title={`YouTube video player ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
              <ReviewList
                reviews={reviews}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />

              {isAuthenticated() && !isStudioOwner && (
                <div className="mt-8">
                  {!userHasReviewed && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Write a Review
                    </button>
                  )}

                  {showReviewForm && (
                    <div className="mt-6">
                      <ReviewForm
                        studioId={studioId}
                        onSubmit={handleReviewSubmit}
                        initialValues={editingReview}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-1">
            {/* Booking Section */}
            <div className="sticky top-4">
              {isAuthenticated() ? (
                <>
                  <AvailabilityCalendar
                    availableSlots={availableSlots}
                    packages={studio.packages || []}
                    operationalHours={studio.operationalHours}
                    onSlotSelect={handleSlotSelect}
                  />

                  {selectedSlot && (
                    <div className="mt-6">
                      <BookingForm
                        studio={studio}
                        selectedSlot={selectedSlot}
                        onBookingComplete={handleBookingComplete}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Want to book this studio?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Sign in or create an account to book this studio.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full bg-white text-indigo-600 py-3 px-4 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDetails;
