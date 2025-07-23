import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPendingStudios, getAllBookingsAdmin } from "../../api";
import Sidebar from "../../components/Sidebar";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Search,
  User,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Mic,
  Camera,
  Wallet,
} from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";

const AdminDashboard = () => {
  const [pendingStudios, setPendingStudios] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("upcoming");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pending studios
        const pendingResponse = await getPendingStudios();
        setPendingStudios(pendingResponse.data);

        // Fetch all bookings
        const bookingsResponse = await getAllBookingsAdmin();
        setAllBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allBookings];

    // Filter by status (upcoming/past)
    const now = new Date();
    if (filterStatus === "upcoming") {
      filtered = filtered.filter((booking) => {
        const bookingDate = parseISO(booking.date);
        return (
          isAfter(bookingDate, now) ||
          format(bookingDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
        );
      });
    } else if (filterStatus === "past") {
      filtered = filtered.filter((booking) => {
        const bookingDate = parseISO(booking.date);
        return (
          !isAfter(bookingDate, now) &&
          format(bookingDate, "yyyy-MM-dd") !== format(now, "yyyy-MM-dd")
        );
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.studio?.name?.toLowerCase().includes(term) ||
          booking.customer?.name?.toLowerCase().includes(term) ||
          booking.customer?.email?.toLowerCase().includes(term) ||
          booking.studio?.location?.city?.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  }, [allBookings, searchTerm, filterStatus]);

  // Count upcoming and past bookings
  const now = new Date();
  const upcomingBookings = allBookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return (
      isAfter(bookingDate, now) ||
      format(bookingDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
    );
  });

  const pastBookings = allBookings.filter((booking) => {
    const bookingDate = parseISO(booking.date);
    return (
      !isAfter(bookingDate, now) &&
      format(bookingDate, "yyyy-MM-dd") !== format(now, "yyyy-MM-dd")
    );
  });

  // Calculate revenue
  const totalRevenue = allBookings.reduce(
    (sum, booking) => sum + (booking.totalPrice || 0),
    0
  );
  const monthlyRevenue = allBookings
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Monitor and manage the entire PodHive platform
                </p>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <span className="font-medium">Admin Panel</span>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Pending Studios
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {pendingStudios.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-6 w-6 text-white" />
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
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Total Bookings
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {allBookings.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Platform Revenue
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
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
                      to="/admin/studios/pending"
                      className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all duration-200 group"
                    >
                      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Review Pending Studios
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Approve or deny studio submissions
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/admin/bookings"
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Manage All Bookings
                        </h3>
                        <p className="text-gray-600 text-sm">
                          View and manage platform bookings
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Platform Overview */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Platform Overview
                  </h2>
                  <div className="space-y-4">
                    {pendingStudios.length > 0 ? (
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
                              Requires immediate attention
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <div className="flex items-center text-green-800">
                          <CheckCircle className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-semibold">
                              No pending studios to approve
                            </span>
                            <p className="text-sm text-green-600 mt-1">
                              All submissions are up to date
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-800">
                          <Calendar className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-semibold">
                              Active Bookings
                            </span>
                            <p className="text-sm text-blue-600 mt-1">
                              {upcomingBookings.length} upcoming sessions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

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

              {/* Booking Analysis Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Booking Analysis
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Bookings</option>
                      <option value="upcoming">Upcoming Only</option>
                      <option value="past">Past Only</option>
                    </select>
                  </div>
                </div>

                {filteredBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Studio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Package
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings.slice(0, 10).map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                  <Mic className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.studio?.name || "Unknown Studio"}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {booking.studio?.location?.city ||
                                      "Unknown Location"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-gray-500" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.customer?.name ||
                                      "Unknown Customer"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.customer?.email || "No email"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {format(parseISO(booking.date), "MMM d, yyyy")}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.hours
                                  ? booking.hours
                                      .map((h) => formatHour(h))
                                      .join(", ")
                                  : "No hours specified"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Camera className="h-4 w-4 mr-1" />
                                {booking.packageKey || "No package"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm font-medium text-gray-900">
                                ₹{booking.totalPrice}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isAfter(parseISO(booking.date), now) ||
                                  format(
                                    parseISO(booking.date),
                                    "yyyy-MM-dd"
                                  ) === format(now, "yyyy-MM-dd")
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {isAfter(parseISO(booking.date), now) ||
                                format(parseISO(booking.date), "yyyy-MM-dd") ===
                                  format(now, "yyyy-MM-dd")
                                  ? "Upcoming"
                                  : "Completed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredBookings.length > 10 && (
                      <div className="mt-4 text-center">
                        <Link
                          to="/admin/bookings"
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          View All Bookings
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bookings found
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "No bookings have been made yet."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
