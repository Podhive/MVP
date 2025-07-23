import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const AvailabilityCalendar = ({ availableSlots, packages, onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Memoize the available hours for the selected date for efficiency.
  const availableHoursForSelectedDate = useMemo(() => {
    if (!selectedDate || !availableSlots) {
      return [];
    }
    const todaysData = availableSlots.find(
      (day) => new Date(day.date).toDateString() === selectedDate.toDateString()
    );

    // **MODIFIED**: Added sorting for the hours array
    if (todaysData && todaysData.hours) {
      // Sort hours in ascending order (e.g., 9, 10, 11, 12)
      return [...todaysData.hours].sort((a, b) => a - b);
    }

    return [];
  }, [selectedDate, availableSlots]);

  // Function to determine which dates are selectable in the calendar
  const isDateAvailable = (dateToFilter) => {
    if (!availableSlots) return false;
    // Check if any entry in the API data matches the date
    return availableSlots.some(
      (day) => new Date(day.date).toDateString() === dateToFilter.toDateString()
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Reset selections when the date changes
    setSelectedHours([]);
    setSelectedPackage(null);
  };

  const handleHourToggle = (hour) => {
    setSelectedHours((prev) => {
      if (prev.includes(hour)) {
        return prev.filter((h) => h !== hour);
      } else {
        return [...prev, hour].sort((a, b) => a - b);
      }
    });
  };

  const handlePackageSelect = (packageKey) => {
    setSelectedPackage(packageKey);
  };

  const handleConfirmSelection = () => {
    if (
      selectedDate &&
      selectedHours.length > 0 &&
      selectedPackage &&
      onSlotSelect
    ) {
      const selectedPkg = packages.find((pkg) => pkg.key === selectedPackage);
      const totalHours = selectedHours.length;
      const basePrice = selectedPkg.price * totalHours;

      onSlotSelect({
        date: selectedDate,
        hours: selectedHours,
        packageKey: selectedPackage,
        package: selectedPkg,
        basePrice: basePrice,
      });
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-900">
        Select Date & Time
      </h3>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Date
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          filterDate={isDateAvailable}
          minDate={new Date()}
          placeholderText="Select an available date"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Hour Selection */}
      {selectedDate && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-900">
            Available Hours for {format(selectedDate, "MMMM d, yyyy")}
          </h4>

          {availableHoursForSelectedDate.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableHoursForSelectedDate.map((hour) => (
                <button
                  key={hour}
                  onClick={() => handleHourToggle(hour)}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    selectedHours.includes(hour)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  {formatHour(hour)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No available hours for this date.
            </p>
          )}
        </div>
      )}

      {/* Package Selection */}
      {selectedHours.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-900">Select Package</h4>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.key}
                onClick={() => handlePackageSelect(pkg.key)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPackage === pkg.key
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {pkg.name || pkg.key}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{pkg.price}
                    </span>
                    <p className="text-xs text-gray-500">per hour</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary & Confirm Button */}
      {selectedDate && selectedHours.length > 0 && selectedPackage && (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2 text-gray-900">
              Selection Summary
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
              <p>
                <span className="font-medium">Hours:</span>{" "}
                {selectedHours.map((h) => formatHour(h)).join(", ")}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {selectedHours.length} hour{selectedHours.length > 1 ? "s" : ""}
              </p>
              <p>
                <span className="font-medium">Package:</span>{" "}
                {packages.find((p) => p.key === selectedPackage)?.name ||
                  selectedPackage}
              </p>
              <p>
                <span className="font-medium">Base Price:</span> ₹
                {packages.find((p) => p.key === selectedPackage)?.price *
                  selectedHours.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleConfirmSelection}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm"
          >
            Continue to Add-ons & Booking
          </button>
        </>
      )}

      {!selectedDate && (
        <p className="text-gray-500 text-sm">
          Please select a date to view available time slots.
        </p>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
