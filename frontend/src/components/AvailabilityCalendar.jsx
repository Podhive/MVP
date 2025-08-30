import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay, parseISO, isToday } from "date-fns";

const AvailabilityCalendar = ({ availableSlots, packages, onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(""); // Use a string to handle the default empty state of the select
  const [duration, setDuration] = useState(0); // Set initial duration state to 0
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Memoize the array of available dates so it's not recalculated on every render.
  const availableDates = useMemo(() => {
    return availableSlots.map((slot) => parseISO(slot.date));
  }, [availableSlots]);

  // Find the available hours for the date the user has selected.
  const availableStartTimes = useMemo(() => {
    if (!selectedDate || !availableSlots) {
      return [];
    }
    const todaysData = availableSlots.find((day) =>
      isSameDay(parseISO(day.date), selectedDate)
    );

    if (todaysData && todaysData.hours) {
      // Sort the hours numerically before any filtering
      const sortedHours = [...todaysData.hours].sort((a, b) => a - b);

      // If the selected date is today, filter out past hours.
      if (isToday(selectedDate)) {
        const currentHour = new Date().getHours();
        return sortedHours.filter((hour) => hour > currentHour);
      }
      return sortedHours;
    }

    return [];
  }, [selectedDate, availableSlots]);

  // Calculate the maximum consecutive hours available from the selected start time.
  const availableDurations = useMemo(() => {
    if (!startTime) return [];

    const start = parseInt(startTime, 10);
    const startIndex = availableStartTimes.indexOf(start);
    if (startIndex === -1) return [];

    let maxDuration = 1;
    for (let i = startIndex + 1; i < availableStartTimes.length; i++) {
      if (availableStartTimes[i] === availableStartTimes[i - 1] + 1) {
        maxDuration++;
      } else {
        break;
      }
    }

    // Return an array of numbers from 1 to maxDuration, e.g., [1, 2, 3]
    return Array.from({ length: maxDuration }, (_, i) => i + 1);
  }, [startTime, availableStartTimes]);

  // Derive the final selected hours based on start time and duration
  const selectedHours = useMemo(() => {
    if (!startTime || duration === 0) return []; // Return empty if duration is 0
    const start = parseInt(startTime, 10);
    // Generate an array of consecutive hours
    return Array.from({ length: duration }, (_, i) => start + i);
  }, [startTime, duration]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setStartTime("");
    setDuration(0); // Reset duration to 0 when date changes
    setSelectedPackage(null);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    setDuration(1); // Reset duration to 1 when a start time is chosen
    setSelectedPackage(null); // Reset package selection
  };

  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value, 10));
    setSelectedPackage(null); // Reset package selection
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
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return format(date, "h:00 a"); // e.g., "1:00 PM"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-900">
        Select Date & Time
      </h3>

      {/* Date Selection */}
      <div className="mb-6">
        <label
          htmlFor="date-picker"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Choose Date
        </label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={handleDateChange}
          includeDates={availableDates}
          minDate={new Date()}
          placeholderText="Select an available date"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Start Time Dropdown */}
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Time
            </label>
            <select
              id="start-time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              disabled={availableStartTimes.length === 0}
            >
              <option value="" disabled>
                {availableStartTimes.length > 0
                  ? "Start time"
                  : "No slots available"}
              </option>
              {availableStartTimes.map((hour) => (
                <option key={hour} value={hour}>
                  {formatHour(hour)}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Dropdown */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={handleDurationChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              disabled={!startTime}
            >
              {/* Conditionally render placeholder or actual durations */}
              {!startTime ? (
                <option value="0">0 hour</option>
              ) : (
                availableDurations.map((d) => (
                  <option key={d} value={d}>
                    {d} hour{d > 1 ? "s" : ""}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      )}

      {/* Package Selection */}
      {startTime && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-900">Select Package</h4>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.key}
                onClick={() => handlePackageSelect(pkg.key)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPackage === pkg.key
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
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
                  <div className="text-right flex-shrink-0 ml-4">
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
      {selectedDate && startTime && selectedPackage && (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3 text-gray-900">
              Selection Summary
            </h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium text-gray-900">Date:</span>{" "}
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
              <p>
                <span className="font-medium text-gray-900">Time Slots:</span>{" "}
                {selectedHours.map((h) => formatHour(h)).join(" → ")}
              </p>
              <p>
                <span className="font-medium text-gray-900">Duration:</span>{" "}
                {duration} hour{duration > 1 ? "s" : ""}
              </p>
              <p>
                <span className="font-medium text-gray-900">Package:</span>{" "}
                {packages.find((p) => p.key === selectedPackage)?.name ||
                  selectedPackage}
              </p>
              <p className="font-bold text-lg text-gray-900 mt-2 pt-2 border-t border-gray-200">
                <span className="font-medium">Total Price:</span> ₹
                {packages.find((p) => p.key === selectedPackage)?.price *
                  duration}
              </p>
            </div>
          </div>
          <button
            onClick={handleConfirmSelection}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-indigo-300/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Continue to Add-ons & Booking
          </button>
        </>
      )}

      {!selectedDate && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Please select a date to view available time slots.
        </p>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
