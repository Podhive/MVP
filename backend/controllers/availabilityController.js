const mongoose = require("mongoose");
const Availability = require("../models/Availability");

const getAvailableSlots = async (req, res) => {
  const { studioId } = req.params;

  try {
    // --- TIMEZONE-AWARE LOGIC ---
    // We assume the server is running in or configured for the IST timezone.
    const now = new Date();
    // Get the start of today (00:00:00) to use for date comparisons.
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Get the current hour (0-23).
    const currentHour = now.getHours();
    // --- END OF TIMEZONE LOGIC ---

    const availableData = await Availability.aggregate([
      {
        // 1. Match the specific studio and any availability from today onwards.
        $match: {
          studio: new mongoose.Types.ObjectId(studioId),
          date: { $gte: today },
        },
      },
      {
        // 2. Deconstruct the slots array to process each slot individually.
        $unwind: "$slots",
      },
      {
        // 3. Filter for slots that are marked as available.
        $match: {
          "slots.isAvailable": true,
        },
      },
      {
        // 4. THE CORE FIX:
        // Filter out past hours for the current day.
        // This logic keeps a slot if:
        // - The slot's date is in the future (greater than today), OR
        // - The slot's date is today AND its hour is greater than or equal to the current hour.
        $match: {
          $or: [
            { date: { $gt: today } },
            {
              $and: [
                { date: { $eq: today } },
                { "slots.hour": { $gte: currentHour } },
              ],
            },
          ],
        },
      },
      {
        // 5. Group the remaining available slots back together by date.
        $group: {
          _id: "$date",
          availableHours: { $addToSet: "$slots.hour" },
        },
      },
      {
        // 6. Sort the results chronologically.
        $sort: {
          _id: 1,
        },
      },
      {
        // 7. Format the output for the frontend.
        $project: {
          _id: 0,
          date: "$_id",
          hours: "$availableHours",
        },
      },
    ]);

    res.json(availableData);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

module.exports = { getAvailableSlots };
