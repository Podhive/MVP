import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getCustomerBookings } from "../../api";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { Calendar, Clock, DollarSign, CheckCircle, Clock3 } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getCustomerBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load your bookings. Please try again later.");
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatHours = (hoursArray) => {
    if (!Array.isArray(hoursArray) || hoursArray.length === 0)
      return "No hours booked";
    const sorted = [...hoursArray].sort((a, b) => a - b);
    return sorted.map((h) => `${h}:00`).join(", ");
  };

  const isUpcoming = (bookingDate) => new Date(bookingDate) >= new Date();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

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
                      Studio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.studio?.name || "Unknown Studio"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.studio?.location?.city || "Unknown Location"}
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
                          className={`flex items-center text-sm font-medium ${
                            isUpcoming(booking.date)
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {isUpcoming(booking.date) ? (
                            <>
                              <Clock3 className="h-4 w-4 mr-1" />
                              Upcoming
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed
                            </>
                          )}
                        </span>
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
            <h2 className="text-xl font-semibold mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't booked any studios yet. Browse available studios and
              make your first booking!
            </p>
            <a
              href="/studios"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Browse Studios
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
