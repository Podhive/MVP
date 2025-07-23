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
});

const addStudio = async (req, res) => {
  try {
    const { name, description, pricePerHour } = req.body;
    const {
      equipments,
      packages,
      addons,
      location,
      availability,
      operationalHours,
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
    const studios = await Studio.find({ approved: true });
    const slots = await Availability.find({
      studio: { $in: studios.map((s) => s._id) },
    });
    const slotMap = slots.reduce((acc, s) => {
      const id = s.studio.toString();
      acc[id] = acc[id] || [];
      acc[id].push(s);
      return acc;
    }, {});
    return res.json(
      studios.map((studio) => ({
        ...studio.toObject(),
        availability: slotMap[studio._id.toString()] || [],
        ratingSummary: studio.ratingSummary || { average: 0, count: 0 },
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: "Not found" });
    if (!studio.approved)
      return res.status(403).json({ message: "Not approved" });
    if (studio.author.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    if (req.files?.length) {
      studio.images = await uploadImages(req.files);
    } else if (req.body.existingImages) {
      studio.images = JSON.parse(req.body.existingImages);
    }

    const {
      equipments,
      packages,
      addons,
      location,
      availability,
      operationalHours,
    } = parseJsonFields(req.body);

    ["name", "description", "pricePerHour"].forEach((f) => {
      if (req.body[f] != null) studio[f] = req.body[f];
    });

    Object.assign(studio, {
      equipments,
      packages,
      addons,
      location,
      operationalHours,
    });

    if (availability.length) {
      await Availability.deleteMany({ studio: studio._id });
      const slots = availability.map((day) => ({
        studio: studio._id,
        date: day.date,
        slots: day.slots.map((s) => ({
          hour: s.hour,
          isAvailable: s.isAvailable ?? true,
        })),
      }));
      await Availability.insertMany(slots);
    }

    const updated = await studio.save();
    return res.json(updated);
  } catch (err) {
    console.error(" updateStudio error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: "Studio not found" });
    if (!studio.approved)
      return res.status(403).json({ message: "Studio not approved" });
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
