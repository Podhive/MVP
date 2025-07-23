import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStudios, getOwnerBookings } from "../../api";
import Sidebar from "../../components/Sidebar";
import {
  Mic,
  Calendar,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Camera,
  Wallet,
  Star,
} from "lucide-react";
import useAuth from "../../context/useAuth";
import { format, isAfter, parseISO } from "date-fns";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [studios, setStudios] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all studios
        const studiosResponse = await fetchStudios();
        // Filter studios owned by the current user
        const myStudios = studiosResponse.data.filter((studio) => {
          const authorId =
            typeof studio.author === "object"
              ? studio.author._id
              : studio.author;
          return authorId === user?._id;
        });
        setStudios(myStudios);

        // Fetch bookings received
        const bookingsResponse = await getOwnerBookings();
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [user]);

  // Count approved and pending studios
  const approvedStudios = studios.filter((studio) => studio.approved);
  const pendingStudios = studios.filter((studio) => !studio.approved);

  // Count upcoming bookings
  const now = new Date();
  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return (
      isAfter(bookingDate, now) ||
      format(bookingDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
    );
  });

  // Calculate total revenue
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.totalPrice || 0),
    0
  );
  const monthlyRevenue = bookings
    .filter((booking) => {
      const bookingDate = parseISO(booking.date);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Studio Owner Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your podcast studios and grow your business
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">Studio Owner</span>
                  </div>
                </div>
                <Link
                  to="/owner/studios/new"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Studio
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Active Studios
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {approvedStudios.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Mic className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Pending Approval
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {pendingStudios.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Upcoming Bookings
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {upcomingBookings.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions and Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Quick Actions
                  </h2>
                  <div className="space-y-4">
                    <Link
                      to="/owner/studios/new"
                      className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 group"
                    >
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <PlusCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Add New Studio
                        </h3>
                        <p className="text-gray-600 text-sm">
                          List a new podcast studio for booking
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/owner/studios"
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Manage Studios
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Edit and manage your existing studios
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/owner/bookings"
                      className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
                    >
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          View Bookings
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Check bookings received for your studios
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Business Overview */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Business Overview
                  </h2>
                  <div className="space-y-4">
                    {approvedStudios.length > 0 ? (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <div className="flex items-center text-green-800">
                          <CheckCircle className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-semibold">
                              {approvedStudios.length} active{" "}
                              {approvedStudios.length === 1
                                ? "studio"
                                : "studios"}
                            </span>
                            <p className="text-sm text-green-600 mt-1">
                              Ready to receive bookings
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center text-gray-800">
                          <Mic className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-semibold">
                              No active studios yet
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              Add your first studio to start earning
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {pendingStudios.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center text-yellow-800">
                          <AlertTriangle className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-semibold">
                              {pendingStudios.length}{" "}
                              {pendingStudios.length === 1
                                ? "studio"
                                : "studios"}{" "}
                              pending approval
                            </span>
                            <p className="text-sm text-yellow-600 mt-1">
                              Waiting for admin review
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-purple-800">
                          {/* <DollarSign className="h-5 w-5 mr-3" /> */}

                          <Wallet className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-semibold">
                              This Month's Revenue
                            </span>
                            <p className="text-sm text-purple-600 mt-1">
                              ₹{monthlyRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            ₹{monthlyRevenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Bookings
                </h2>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                            <Camera className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {booking.studio?.name}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <span>{booking.customer?.name}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {format(parseISO(booking.date), "MMM d, yyyy")}
                              </span>
                            </div>
                            {booking.hours && (
                              <div className="text-sm text-gray-500 mt-1">
                                {booking.hours
                                  .map((h) => formatHour(h))
                                  .join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">
                            ₹{booking.totalPrice}
                          </div>
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

                    {bookings.length > 5 && (
                      <Link
                        to="/owner/bookings"
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
                      Once you have approved studios, bookings will appear here
                    </p>
                  </div>
                )}
              </div>

              {/* Tips for Success */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white">
                <h2 className="text-2xl font-bold mb-6">Tips for Success</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">High-Quality Photos</h3>
                    <p className="text-indigo-100 text-sm">
                      Upload professional photos of your studio to attract more
                      bookings and showcase your equipment.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      Keep Availability Updated
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      Regularly update your availability calendar to avoid
                      scheduling conflicts and maximize bookings.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Excellent Service</h3>
                    <p className="text-indigo-100 text-sm">
                      Provide exceptional service to earn positive reviews and
                      build a strong reputation in the community.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Studios Section */}
              {pendingStudios.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Studios Pending Approval
                  </h2>
                  <div className="space-y-4">
                    {pendingStudios.map((studio) => (
                      <div
                        key={studio._id}
                        className="flex items-center justify-between p-4 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl"
                      >
                        <div className="flex items-center">
                          <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                            <Mic className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {studio.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Submitted on{" "}
                              {format(
                                new Date(studio.createdAt),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          Pending Review
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
