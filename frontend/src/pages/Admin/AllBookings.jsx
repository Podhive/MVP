import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAllBookingsAdmin, deleteBookingAdmin } from "../../api";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import {
  Calendar,
  Clock,
  DollarSign,
  Trash,
  User,
  Mail,
  MapPin,
} from "lucide-react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookingsAdmin();
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this booking? This will restore the slot availability."
      )
    ) {
      try {
        await deleteBookingAdmin(bookingId);
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        toast.success("Booking deleted and slot restored");
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete booking"
        );
      }
    }
  };

  const formatHours = (hoursArray) => {
    if (!Array.isArray(hoursArray) || hoursArray.length === 0)
      return "No hours";
    const sorted = [...hoursArray].sort((a, b) => a - b);
    return sorted.map((h) => `${h}:00`).join(", ");
  };

  const isUpcoming = (bookingDate) => {
    return new Date(bookingDate) >= new Date();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <span className="ml-3 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            Admin Panel
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : bookings.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
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
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {booking._id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.studio?.name || "Unknown Studio"}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.studio?.location?.city || "Unknown Location"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {booking.customer?.name || "Unknown Customer"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          {booking.customer?.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-900">
                            {format(new Date(booking.date), "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatHours(booking.hours)}</span>
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
                            booking.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.paymentStatus === "paid"
                            ? "Paid"
                            : "Pay at Studio"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isUpcoming(booking.date)
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isUpcoming(booking.date) ? "Upcoming" : "Completed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mb-4">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Bookings Found</h2>
            <p className="text-gray-600">
              There are no bookings in the system yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
