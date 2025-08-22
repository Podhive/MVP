// controllers/studioController.js
const Studio = require("../models/Studio");
const Availability = require("../models/Availability");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure tmp directory exists
const tmpDir = path.join(__dirname, "../tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Multer setup
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, tmpDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Helper: upload and clean temp images
const uploadImages = async (files) => {
  const uploaded = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "studios",
    });
    uploaded.push(result.secure_url);
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      // silent fail on cleanup
    }
  }
  return uploaded;
};

// Parse JSON fields from multipart/form-data
const parseJsonFields = (body) => ({
  equipments: body.equipments ? JSON.parse(body.equipments) : [],
  packages: body.packages ? JSON.parse(body.packages) : [],
  addons: body.addons ? JSON.parse(body.addons) : [],
  location: body.location ? JSON.parse(body.location) : {},
  availability: body.availability ? JSON.parse(body.availability) : [],
  operationalHours: body.operationalHours
    ? JSON.parse(body.operationalHours)
    : {},
  youtubeLinks: body.youtubeLinks ? JSON.parse(body.youtubeLinks) : [],
  existingImages: body.existingImages ? JSON.parse(body.existingImages) : [],
});

const addStudio = async (req, res) => {
  try {
    const { name, description, pricePerHour, instagramUsername } = req.body;
    const {
      equipments,
      packages,
      addons,
      location,
      availability,
      operationalHours,
      youtubeLinks,
    } = parseJsonFields(req.body);

    const uploadedImages = await uploadImages(req.files || []);

    const studio = new Studio({
      name,
      description,
      author: req.user._id,
      equipments,
      images: uploadedImages,
      location,
      operationalHours,
      packages,
      addons,
      youtubeLinks,
      instagramUsername,
      approved: false,
      pricePerHour: parseFloat(pricePerHour),
    });

    const createdStudio = await studio.save();

    if (availability.length) {
      const slots = availability.map((day) => ({
        studio: createdStudio._id,
        date: day.date,
        slots: day.slots.map((s) => ({
          hour: s.hour,
          isAvailable: s.isAvailable ?? true,
        })),
      }));
      await Availability.insertMany(slots);
    }

    return res.status(201).json(createdStudio);
  } catch (error) {
    console.error("❌ addStudio error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getStudios = async (req, res) => {
  try {
    // 1. Fetch all approved studios first.
    const studios = await Studio.find({ approved: true });

    if (!studios.length) {
      return res.json([]);
    }

    // --- TIMEZONE-AWARE LOGIC ---
    // Assuming the server is configured for the IST timezone.
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today (00:00:00)
    const currentHour = now.getHours(); // Current hour (0-23)
    // --- END ---

    const studioIds = studios.map((s) => s._id);

    // 2. Fetch and filter availability for all studios in a single, efficient database query.
    const filteredSlots = await Availability.aggregate([
      {
        // Match availability for the relevant studios and from today onwards.
        $match: {
          studio: { $in: studioIds },
          date: { $gte: today },
        },
      },
      {
        // Deconstruct the slots array to process each slot.
        $unwind: "$slots",
      },
      {
        // Filter for slots that are actually available.
        $match: {
          "slots.isAvailable": true,
        },
      },
      {
        // THE CORE FIX: Filter out past hours for the current day.
        $match: {
          $or: [
            { date: { $gt: today } }, // Keep if the date is in the future.
            {
              $and: [
                { date: { $eq: today } }, // OR if the date is today...
                { "slots.hour": { $gte: currentHour } }, // ...and the hour has not passed yet.
              ],
            },
          ],
        },
      },
      {
        // Group the valid slots back together by their original studio and date.
        $group: {
          _id: { studio: "$studio", date: "$date" },
          slots: { $push: "$slots" },
        },
      },
      {
        // Now, group all the date documents by studio ID.
        $group: {
          _id: "$_id.studio",
          availability: {
            $push: {
              date: "$_id.date",
              slots: "$slots",
            },
          },
        },
      },
    ]);

    // 3. Create a map for easy lookup (Studio ID => Availability Array).
    const slotMap = filteredSlots.reduce((acc, item) => {
      acc[item._id.toString()] = item.availability;
      return acc;
    }, {});

    // 4. Combine the studio data with its filtered availability.
    const studiosWithAvailability = studios.map((studio) => ({
      ...studio.toObject(),
      availability: slotMap[studio._id.toString()] || [], // Use filtered availability or an empty array
      ratingSummary: studio.ratingSummary || { average: 0, count: 0 },
    }));

    return res.json(studiosWithAvailability);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }
    if (studio.author.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this studio" });
    }

    const { name, description, pricePerHour, instagramUsername } = req.body;
    const {
      equipments,
      packages,
      addons,
      location,
      availability,
      operationalHours,
      youtubeLinks,
      existingImages,
    } = parseJsonFields(req.body);

    // Image handling
    const newImages = req.files?.length ? await uploadImages(req.files) : [];
    studio.images = [...existingImages, ...newImages];

    // Update studio fields
    studio.name = name;
    studio.description = description;
    studio.pricePerHour = parseFloat(pricePerHour);
    studio.instagramUsername = instagramUsername;
    studio.equipments = equipments;
    studio.packages = packages;
    studio.addons = addons;
    studio.location = location;
    studio.operationalHours = operationalHours;
    studio.youtubeLinks = youtubeLinks;

    // --- ROBUST AVAILABILITY UPDATE ---
    if (availability && Array.isArray(availability)) {
      const bulkOps = availability.map((day) => ({
        updateOne: {
          filter: { studio: studio._id, date: new Date(day.date) },
          update: { $set: { slots: day.slots } },
          upsert: true,
        },
      }));
      if (bulkOps.length > 0) {
        await Availability.bulkWrite(bulkOps);
      }
    }
    // --- END OF FIX ---

    const updatedStudio = await studio.save();
    return res.json(updatedStudio);
  } catch (err) {
    console.error("❌ updateStudio error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: "Studio not found" });

    if (studio.author.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await Availability.deleteMany({ studio: studio._id });

    if (studio.images?.length) {
      for (const url of studio.images) {
        try {
          const publicId = extractPublicIdFromUrl(url, "studios");
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudErr) {
          console.warn(
            `Cloudinary delete failed for ${url}:`,
            cloudErr.message
          );
        }
      }
    }

    await studio.deleteOne();

    return res.json({ message: "Studio removed successfully" });
  } catch (err) {
    console.error("❌ deleteStudio error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

function extractPublicIdFromUrl(url, folderName = "") {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split("/");
    const folderIndex = parts.findIndex((part) => part === folderName);
    if (folderIndex === -1 || folderIndex + 1 >= parts.length) return null;
    const filename = parts.slice(folderIndex + 1).join("/");
    const publicId = filename.replace(/\.[^/.]+$/, "");
    return `${folderName}/${publicId}`;
  } catch (e) {
    console.error("Failed to extract Cloudinary public ID:", e.message);
    return null;
  }
}

module.exports = { upload, addStudio, getStudios, updateStudio, deleteStudio };
