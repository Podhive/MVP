// controllers/studioController.js
const Studio = require("../models/Studio");
const Availability = require("../models/Availability");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

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

// Helper: apply watermark, upload buffer, and clean temp images
// Helper: apply watermark, upload buffer, and clean temp images
// Helper with enhanced logging
// Helper: apply watermark, upload buffer, and clean temp images
const uploadImages = async (files) => {
  const watermarkText = "Podhive";
  const watermarkSvg = Buffer.from(
    `<svg width="250" height="100">
      <text
        x="50%" y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-size="24"
        font-family="sans-serif"
        font-weight="bold"
        fill="rgba(255, 255, 255, 0.4)"
        transform="rotate(-25 125 50)">
        ${watermarkText}
      </text>
    </svg>`
  );

  const uploadPromises = files.map(async (file) => {
    try {
      // 1. Read the entire file into a buffer FIRST.
      // This immediately closes the file handle, preventing the EPERM lock issue.
      const fileBuffer = fs.readFileSync(file.path);

      // 2. Process the buffer in memory using sharp.
      const watermarkedBuffer = await sharp(fileBuffer)
        .composite([
          {
            input: watermarkSvg,
            tile: true,
            gravity: "center",
          },
        ])
        .toBuffer();

      // 3. Upload the resulting buffer to Cloudinary.
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "studios" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(watermarkedBuffer);
      });

      return result.secure_url;
    } catch (processErr) {
      console.error(
        `Failed to process/upload ${file.originalname}:`,
        processErr
      );
      return null;
    } finally {
      // 4. Clean up the now-unlocked original temp file.
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupErr) {
        console.warn(
          `Failed to clean up temp file ${file.path}:`,
          cleanupErr.message
        );
      }
    }
  });

  const results = await Promise.all(uploadPromises);
  return results.filter((url) => url);
};

// Parse JSON fields from multipart/form-data
const parseJsonFields = (body) => ({
  equipments: body.equipments ? JSON.parse(body.equipments) : [],
  amenities: body.amenities ? JSON.parse(body.amenities) : [],
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
    const {
      name,
      description,
      pricePerHour,
      instagramUsername,
      area,
      rules,
      minimumDurationHours,
    } = req.body;
    const {
      equipments,
      amenities,
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
      amenities,
      images: uploadedImages,
      location,
      operationalHours,
      packages,
      addons,
      youtubeLinks,
      instagramUsername,
      approved: false,
      pricePerHour: parseFloat(pricePerHour),
      minimumDurationHours: parseInt(minimumDurationHours, 10) || 1,
      area: area ? parseInt(area, 10) : undefined,
      rules,
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

    if (!studios.length) {
      return res.json([]);
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentHour = now.getHours();

    const studioIds = studios.map((s) => s._id);

    const filteredSlots = await Availability.aggregate([
      {
        $match: {
          studio: { $in: studioIds },
          date: { $gte: today },
        },
      },
      { $unwind: "$slots" },
      { $match: { "slots.isAvailable": true } },
      {
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
        $group: {
          _id: { studio: "$studio", date: "$date" },
          slots: { $push: "$slots" },
        },
      },
      {
        $group: {
          _id: "$_id.studio",
          availability: {
            $push: { date: "$_id.date", slots: "$slots" },
          },
        },
      },
    ]);

    const slotMap = filteredSlots.reduce((acc, item) => {
      acc[item._id.toString()] = item.availability;
      return acc;
    }, {});

    const studiosWithAvailability = studios.map((studio) => ({
      ...studio.toObject(),
      availability: slotMap[studio._id.toString()] || [],
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

    const {
      name,
      description,
      pricePerHour,
      instagramUsername,
      area,
      rules,
      minimumDurationHours,
    } = req.body;
    const {
      equipments,
      amenities,
      packages,
      addons,
      location,
      availability,
      operationalHours,
      youtubeLinks,
      existingImages,
    } = parseJsonFields(req.body);

    const newImages = req.files?.length ? await uploadImages(req.files) : [];
    studio.images = [...existingImages, ...newImages];

    studio.name = name;
    studio.description = description;
    studio.pricePerHour = parseFloat(pricePerHour);
    studio.instagramUsername = instagramUsername;
    studio.equipments = equipments;
    studio.amenities = amenities;
    studio.packages = packages;
    studio.addons = addons;
    studio.location = location;
    studio.operationalHours = operationalHours;
    studio.youtubeLinks = youtubeLinks;
    studio.minimumDurationHours = parseInt(minimumDurationHours, 10) || 1;
    studio.area = area ? parseInt(area, 10) : undefined;
    studio.rules = rules;

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
