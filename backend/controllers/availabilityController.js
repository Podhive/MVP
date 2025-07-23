const mongoose = require("mongoose");
const Availability = require("../models/Availability");

const getAvailableSlots = async (req, res) => {
  const { studioId } = req.params;

  try {
    const availableData = await Availability.aggregate([
      {
        $match: {
          studio: new mongoose.Types.ObjectId(studioId),
        },
      },
      {
        $unwind: "$slots",
      },
      {
        $match: {
          "slots.isAvailable": true,
        },
      },
      {
        $group: {
          _id: "$date",
          availableHours: { $addToSet: "$slots.hour" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
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
