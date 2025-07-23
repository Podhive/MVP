import React, { useState } from "react";
import { format } from "date-fns";
import { createBooking } from "../api";
import { toast } from "react-toastify";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const BookingForm = ({ studio, selectedSlot, onBookingComplete }) => {
  const [paymentStatus, setPaymentStatus] = useState("payAtStudio");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  if (!selectedSlot) {
    return null;
  }

  const {
    date,
    hours,
    packageKey,
    package: selectedPackage,
    basePrice,
  } = selectedSlot;

  const handleAddonQuantityChange = (addonKey, quantity) => {
    setSelectedAddons((prev) => {
      const existing = prev.find((addon) => addon.key === addonKey);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((addon) => addon.key !== addonKey);
        }
        return prev.map((addon) =>
          addon.key === addonKey ? { ...addon, quantity } : addon
        );
      } else if (quantity > 0) {
        return [...prev, { key: addonKey, quantity }];
      }
      return prev;
    });
  };

  const getAddonQuantity = (addonKey) => {
    const addon = selectedAddons.find((addon) => addon.key === addonKey);
    return addon ? addon.quantity : 0;
  };

  const calculateTotalPrice = () => {
    const addonTotal = selectedAddons.reduce((total, selectedAddon) => {
      const studioAddon = studio.addons?.find(
        (addon) => addon.key === selectedAddon.key
      );
      return (
        total + (studioAddon ? studioAddon.price * selectedAddon.quantity : 0)
      );
    }, 0);

    return basePrice + addonTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        studio: studio._id,
        date: format(date, "yyyy-MM-dd"),
        hours: hours,
        packageKey: packageKey,
        addons: selectedAddons,
        totalPrice: calculateTotalPrice(),
        paymentStatus: paymentStatus,
      };

      const response = await createBooking(bookingData);
      toast.success("Booking confirmed successfully!");

      if (onBookingComplete) {
        onBookingComplete(response.data.booking);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <ShoppingCart className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">
          Complete Your Booking
        </h3>
      </div>

      {/* Booking Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <h4 className="font-semibold mb-3 text-gray-900">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Studio:</span>
            <span className="font-medium text-gray-900">{studio.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">
              {format(date, "MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">
              {hours.map((h) => formatHour(h)).join(", ")} ({hours.length} hour
              {hours.length > 1 ? "s" : ""})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium text-gray-900">
              {selectedPackage.name || packageKey}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-bold text-indigo-600">₹{basePrice}</span>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      {studio.addons && studio.addons.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">Add-on Services</h4>
          <div className="space-y-3">
            {studio.addons.map((addon) => (
              <div
                key={addon.key}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{addon.name}</h5>
                    <p className="text-sm text-gray-600">{addon.description}</p>
                    <p className="text-sm font-semibold text-indigo-600">
                      ₹{addon.price} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddonQuantityChange(
                          addon.key,
                          Math.max(0, getAddonQuantity(addon.key) - 1)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      disabled={getAddonQuantity(addon.key) === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {getAddonQuantity(addon.key)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddonQuantityChange(
                          addon.key,
                          Math.min(
                            addon.maxQuantity || 10,
                            getAddonQuantity(addon.key) + 1
                          )
                        )
                      }
                      className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors"
                      disabled={
                        getAddonQuantity(addon.key) >= (addon.maxQuantity || 10)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {addon.maxQuantity && (
                  <p className="text-xs text-gray-500">
                    Max quantity: {addon.maxQuantity}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Price */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Total Price:
          </span>
          <span className="text-2xl font-bold text-indigo-600">
            ₹{calculateTotalPrice()}
          </span>
        </div>
        {selectedAddons.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>₹{basePrice}</span>
              </div>
              {selectedAddons.map((selectedAddon) => {
                const studioAddon = studio.addons?.find(
                  (addon) => addon.key === selectedAddon.key
                );
                return studioAddon ? (
                  <div key={selectedAddon.key} className="flex justify-between">
                    <span>
                      {studioAddon.name} × {selectedAddon.quantity}:
                    </span>
                    <span>₹{studioAddon.price * selectedAddon.quantity}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Option
          </label>
          <div className="space-y-3">
            {/* <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentStatus"
                value="paid"
                checked={paymentStatus === 'paid'}
                onChange={() => setPaymentStatus('paid')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">Pay Now</span>
                <p className="text-sm text-gray-600">Secure online payment</p>
              </div>
            </label> */}
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentStatus"
                value="payAtStudio"
                checked={paymentStatus === "payAtStudio"}
                onChange={() => setPaymentStatus("payAtStudio")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">Pay at Studio</span>
                <p className="text-sm text-gray-600">Pay when you arrive</p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Processing...
            </div>
          ) : (
            `Book Now - ₹${calculateTotalPrice()}`
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
