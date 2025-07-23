// routes/studioRoutes.js
const express = require("express");
const {
  upload,
  addStudio,
  getStudios,
  updateStudio,
  deleteStudio,
} = require("../controllers/studioController");
const { protect } = require("../middlewares/protect.js");

const router = express.Router();

// 'images' is the field name in the form-data; allow up to 5 files
router.post("/", protect, upload.array("images", 5), addStudio);
router.get("/", getStudios);
router.put("/:id", protect, upload.array("images", 5), updateStudio);
router.delete("/:id", protect, deleteStudio);

module.exports = router;
