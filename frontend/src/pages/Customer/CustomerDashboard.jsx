import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  Calendar,
  Star,
  User,
  TrendingUp,
  Clock,
  MapPin,
  Camera,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { getCustomerBookings } from "../../api";
import useAuth from "../../context/useAuth";
import { format, isAfter, parseISO } from "date-fns";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getCustomerBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate stats
  const now = new Date();
  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return (
      isAfter(bookingDate, now) ||
      format(bookingDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
    );
  });

  const completedBookings = bookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return (
      !isAfter(bookingDate, now) &&
      format(bookingDate, "yyyy-MM-dd") !== format(now, "yyyy-MM-dd")
    );
  });

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (booking.totalPrice || 0),
    0
  );

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 text-lg">
                  Ready to create amazing content?
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="flex items-center">
                    <span className="font-medium">Content Creator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {bookings.length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {upcomingBookings.length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {completedBookings.length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ₹{totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Link
                  to="/studios"
                  className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 group"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Browse Studios
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Find the perfect studio for your next recording
                    </p>
                  </div>
                </Link>

                <Link
                  to="/bookings/customer"
                  className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
                >
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Bookings</h3>
                    <p className="text-gray-600 text-sm">
                      View and manage your studio bookings
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                        <Camera className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {booking.studio?.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{booking.studio?.location?.city}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {format(parseISO(booking.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        {booking.hours && (
                          <div className="text-sm text-gray-500 mt-1">
                            {booking.hours.map((h) => formatHour(h)).join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">
                          ₹{booking.totalPrice}
                        </span>
                        <div
                          className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            isAfter(parseISO(booking.date), now)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isAfter(parseISO(booking.date), now)
                            ? "Upcoming"
                            : "Completed"}
                        </div>
                      </div>
                    </div>
                  ))}

                  {bookings.length > 3 && (
                    <Link
                      to="/bookings/customer"
                      className="block text-center text-indigo-600 hover:text-indigo-800 font-medium mt-4"
                    >
                      View all bookings →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by browsing our amazing studios
                  </p>
                  <Link
                    to="/studios"
                    className="inline-flex items-center bg-indigo-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Browse Studios
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-indigo-900 p-8 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-6">
              Pro Tips for Great Recordings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Test Your Equipment</h3>
                <p className="text-indigo-100 text-sm">
                  Arrive 15 minutes early to test all equipment and ensure
                  everything works perfectly.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Plan Your Content</h3>
                <p className="text-indigo-100 text-sm">
                  Prepare your talking points and questions in advance to make
                  the most of your studio time.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Leave Reviews</h3>
                <p className="text-indigo-100 text-sm">
                  Help other creators by leaving honest reviews about your
                  studio experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
