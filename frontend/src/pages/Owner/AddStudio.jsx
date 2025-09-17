import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createStudio } from "../../api";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import {
  Plus,
  X,
  Upload,
  Calendar,
  Clock,
  Package,
  Wrench,
  Trash2,
  Youtube,
  Instagram,
  Coffee,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addMonths, eachDayOfInterval, startOfDay } from "date-fns";

const DEFAULT_EQUIPMENT_OPTIONS = [
  "Microphone (XLR)",
  "Audio Interface",
  "Headphones (Closed-Back)",
  "Mic Stand / Boom Arm",
  "Pop Filter / Windscreen",
  "Digital Audio Workstation (DAW) Software",
  "Portable Recorder",
  "Acoustic Panels / Soundproofing",
  "Mixer (for multiple mics)",
  "Headphone Amplifier",
  "Webcam (for video podcasts)",
  "XLR Cables",
  "USB Cables",
  "External SSD (Backup Storage)",
  "Shock Mount (for mic stability)",
];

const DEFAULT_AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Restroom",
  "Waiting Area",
  "Free Parking",
  "Wheelchair Accessible",
  "Coffee/Tea",
  "Water Dispenser",
  "Snacks for Purchase",
  "Lounge Area",
  "Changing Room",
  "Green Screen",
  "Teleprompter",
  "Lighting Equipment",
  "On-site Staff",
];

const AddStudio = () => {
  const navigate = useNavigate();
  const userId = "currentUser";
  const LOCAL_STORAGE_KEY = `addStudioFormData_${userId}`;
  const isInitialMount = useRef(true);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerHour: "",
    equipments: [],
    amenities: [],
    customEquipment: "",
    minimumDurationHours: "1",
    operationalHours: {
      start: "9",
      end: "18",
    },
    packages: [
      { key: "No Cam", price: "", description: "Studio without equipments" },
      { key: "1 Cam", price: "", description: "Basic single camera setup" },
      { key: "2 Cam", price: "", description: "Dual camera angles" },
      { key: "3 Cam", price: "", description: "Full setup with 3 cameras" },
    ],
    addons: [],
    location: {
      fullAddress: "",
      city: "",
      state: "",
      pinCode: "",
    },
    youtubeLinks: ["", ""],
    instagramUsername: "",
    area: "",
    rules: "",
  });

  const [customAmenity, setCustomAmenity] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [newAddon, setNewAddon] = useState({
    key: "",
    name: "",
    price: "",
    description: "",
    maxQuantity: 1,
  });

  useEffect(() => {
    const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedDataJSON) return;
    try {
      const savedData = JSON.parse(savedDataJSON);
      const now = new Date().getTime();
      const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;
      if (now - savedData.timestamp > TWO_DAYS_IN_MS) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }
      if (savedData.formData)
        setFormData((prev) => ({ ...prev, ...savedData.formData }));
      if (savedData.newAddon) setNewAddon(savedData.newAddon);
      if (savedData.startDate) setStartDate(new Date(savedData.startDate));
      if (savedData.endDate) setEndDate(new Date(savedData.endDate));
    } catch (error) {
      console.error("Error parsing or loading studio form data:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [LOCAL_STORAGE_KEY]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const dataToSave = {
      formData,
      newAddon,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, newAddon, startDate, endDate, LOCAL_STORAGE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderHourOptions = (isEndTime = false) => {
    const options = [];
    const start = isEndTime ? 1 : 0;
    const limit = isEndTime ? 25 : 24;
    for (let i = start; i < limit; i++) {
      const hour = i === 24 ? 0 : i;
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      let displayTime = format(date, "h a");
      if (isEndTime && i === 24) displayTime = "12 AM (Next Day)";
      options.push(
        <option key={i} value={i}>
          {displayTime}
        </option>
      );
    }
    return options;
  };

  const handleYoutubeLinkChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.map((link, i) =>
        i === index ? value : link
      ),
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData((prev) => ({
      ...prev,
      equipments: prev.equipments.includes(equipment)
        ? prev.equipments.filter((eq) => eq !== equipment)
        : [...prev.equipments, equipment],
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((am) => am !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddCustomAmenity = () => {
    if (
      customAmenity.trim() !== "" &&
      !formData.amenities.includes(customAmenity.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()],
      }));
      setCustomAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((am) => am !== amenity),
    }));
  };

  const handleAddCustomEquipment = () => {
    if (formData.customEquipment.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        equipments: [...prev.equipments, formData.customEquipment.trim()],
        customEquipment: "",
      }));
    }
  };

  const handleRemoveEquipment = (equipment) => {
    setFormData((prev) => ({
      ...prev,
      equipments: prev.equipments.filter((eq) => eq !== equipment),
    }));
  };

  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    }));
  };

  const handleAddAddon = () => {
    if (newAddon.key && newAddon.name && newAddon.price) {
      setFormData((prev) => ({
        ...prev,
        addons: [
          ...prev.addons,
          { ...newAddon, price: parseFloat(newAddon.price) },
        ],
      }));
      setNewAddon({
        key: "",
        name: "",
        price: "",
        description: "",
        maxQuantity: 1,
      });
    }
  };

  const handleRemoveAddon = (index) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImagePreviews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateAvailability = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both a start and end date.");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date cannot be before the start date.");
      return;
    }
    const startHour = parseInt(formData.operationalHours.start, 10);
    const endHour = parseInt(formData.operationalHours.end, 10);
    const minDuration = parseInt(formData.minimumDurationHours, 10);

    if (isNaN(startHour) || isNaN(endHour) || startHour >= endHour) {
      toast.error("Invalid operational hours. Please set a valid time range.");
      return;
    }

    if (endHour - startHour < minDuration) {
      toast.error(
        "Operational hours must be longer than the minimum slot duration."
      );
      return;
    }

    const dateInterval = eachDayOfInterval({
      start: startOfDay(startDate),
      end: startOfDay(endDate),
    });

    const newAvailability = dateInterval.map((date) => {
      const slots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push({ hour, isAvailable: true });
      }
      return {
        dateKey: date.toISOString(),
        date: date,
        slots: slots,
      };
    });

    setAvailability(newAvailability);
    toast.success(`Generated ${newAvailability.length} days of availability.`);
  };

  const handleToggleSlot = (dateKey, hourToToggle) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.dateKey === dateKey) {
          return {
            ...day,
            slots: day.slots.map((slot) =>
              slot.hour === hourToToggle
                ? { ...slot, isAvailable: !slot.isAvailable }
                : slot
            ),
          };
        }
        return day;
      })
    );
  };

  const handleRemoveDate = (dateKeyToRemove) => {
    setAvailability((prev) =>
      prev.filter((day) => day.dateKey !== dateKeyToRemove)
    );
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Studio name is required");
      return;
    }
    const requiredPackages = formData.packages.filter(
      (p) => p.key !== "No Cam"
    );
    if (!requiredPackages.every((pkg) => pkg.price)) {
      toast.error("Prices for 1, 2, and 3 Cam packages are required");
      return;
    }
    if (
      !formData.location.fullAddress ||
      !formData.location.city ||
      !formData.location.state ||
      !formData.location.pinCode
    ) {
      toast.error("All location fields are required");
      return;
    }
    if (availability.length === 0) {
      toast.error("Please generate and confirm availability");
      return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      const formattedAvailability = availability.map((day) => ({
        date: format(day.date, "yyyy-MM-dd"),
        slots: day.slots,
      }));
      const finalPackages = formData.packages.filter(
        (pkg) => pkg.price && parseFloat(pkg.price) > 0
      );
      const prices = finalPackages.map((p) => parseFloat(p.price));
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("pricePerHour", minPrice);
      formDataObj.append("equipments", JSON.stringify(formData.equipments));
      formDataObj.append("amenities", JSON.stringify(formData.amenities));
      formDataObj.append("area", formData.area);
      formDataObj.append("rules", formData.rules);
      formDataObj.append("minimumDurationHours", formData.minimumDurationHours);

      const startHour = parseInt(formData.operationalHours.start, 10);
      const endHour = parseInt(formData.operationalHours.end, 10);

      formDataObj.append(
        "operationalHours",
        JSON.stringify({ start: startHour, end: endHour })
      );
      formDataObj.append(
        "packages",
        JSON.stringify(
          finalPackages.map((pkg) => ({ ...pkg, price: parseFloat(pkg.price) }))
        )
      );
      formDataObj.append("addons", JSON.stringify(formData.addons));
      formDataObj.append("location", JSON.stringify(formData.location));
      formDataObj.append("availability", JSON.stringify(formattedAvailability));
      formDataObj.append(
        "youtubeLinks",
        JSON.stringify(formData.youtubeLinks.filter((link) => link))
      );
      formDataObj.append("instagramUsername", formData.instagramUsername);
      imageFiles.forEach((file) => formDataObj.append("images", file));

      await createStudio(formDataObj);
      toast.success(
        "Studio submitted for approval. Please wait for admin approval."
      );
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      navigate("/owner/studios");
    } catch (error) {
      console.error("Error creating studio:", error);
      toast.error(error.response?.data?.message || "Failed to create studio");
    } finally {
      setLoading(false);
    }
  };

  const getPackageTitle = (key) => {
    switch (key) {
      case "No Cam":
        return "Studio without equipments (Optional)";
      case "1 Cam":
        return "1 Camera Setup (Base Price)";
      case "2 Cam":
        return "2 Camera Setup";
      case "3 Cam":
        return "3 Camera Setup";
      default:
        return "Package";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Studio
            </h1>
            <p className="text-gray-600">
              Create a new podcast studio listing for your space
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Package className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Studio Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter your studio name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Studio Area (in sq ft)
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 250"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Describe your studio, its features, and what makes it special..."
                  ></textarea>
                </div>
                <div className="lg:col-span-2">
                  <label
                    htmlFor="rules"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Rules
                  </label>
                  <textarea
                    id="rules"
                    name="rules"
                    rows="4"
                    value={formData.rules}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., No smoking. Clean up after use."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Instagram className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Social & Video Links
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="instagramUsername"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Instagram Username (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      @
                    </span>
                    <input
                      id="instagramUsername"
                      name="instagramUsername"
                      type="text"
                      value={formData.instagramUsername}
                      onChange={handleChange}
                      className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="your_username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Embed Links (Optional)
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      <Youtube className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.youtubeLinks[0]}
                        onChange={(e) =>
                          handleYoutubeLinkChange(0, e.target.value)
                        }
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g., https://www.youtube.com/embed/your_video_id"
                      />
                    </div>
                    <div className="relative">
                      <Youtube className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.youtubeLinks[1]}
                        onChange={(e) =>
                          handleYoutubeLinkChange(1, e.target.value)
                        }
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g., https://www.youtube.com/embed/your_video_id"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Operational Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="operationalHours.start"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Opening Time *
                  </label>
                  <select
                    id="operationalHours.start"
                    name="operationalHours.start"
                    value={formData.operationalHours.start}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    {renderHourOptions()}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="operationalHours.end"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Closing Time *
                  </label>
                  <select
                    id="operationalHours.end"
                    name="operationalHours.end"
                    value={formData.operationalHours.end}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    {renderHourOptions(true)}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="minimumDurationHours"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Min. Booking (hours) *
                  </label>
                  <select
                    id="minimumDurationHours"
                    name="minimumDurationHours"
                    value={formData.minimumDurationHours}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <option key={h} value={h}>
                        {h} hour{h > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Coffee className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Amenities
                </h2>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Available Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DEFAULT_AMENITIES.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add Custom Amenity
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter custom amenity name"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add
                  </button>
                </div>
              </div>
              {formData.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Selected Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full flex items-center text-sm"
                      >
                        <span className="mr-2">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Wrench className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Equipment
                </h2>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Available Equipment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DEFAULT_EQUIPMENT_OPTIONS.map((equipment) => (
                    <label
                      key={equipment}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.equipments.includes(equipment)}
                        onChange={() => handleEquipmentToggle(equipment)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {equipment}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add Custom Equipment
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.customEquipment}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customEquipment: e.target.value,
                      }))
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter custom equipment name"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomEquipment}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add
                  </button>
                </div>
              </div>
              {formData.equipments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Selected Equipment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.equipments.map((equipment, index) => (
                      <div
                        key={index}
                        className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full flex items-center text-sm"
                      >
                        <span className="mr-2">{equipment}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipment(equipment)}
                          className="text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Packages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Package className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Camera Packages
                </h2>
              </div>
              <div className="space-y-6">
                {formData.packages.map((pkg, index) => (
                  <div
                    key={pkg.key}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {getPackageTitle(pkg.key)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price per Hour (₹) {pkg.key !== "No Cam" && "*"}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={pkg.price}
                          onChange={(e) =>
                            handlePackageChange(index, "price", e.target.value)
                          }
                          required={pkg.key !== "No Cam"}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) =>
                            handlePackageChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Package description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Plus className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Add-on Services
                </h2>
              </div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Key
                    </label>
                    <input
                      type="text"
                      value={newAddon.key}
                      onChange={(e) =>
                        setNewAddon((prev) => ({
                          ...prev,
                          key: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., podcast_edit_full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={newAddon.name}
                      onChange={(e) =>
                        setNewAddon((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., Podcast Edit Full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newAddon.price}
                      onChange={(e) =>
                        setNewAddon((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Service price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newAddon.maxQuantity}
                      onChange={(e) =>
                        setNewAddon((prev) => ({
                          ...prev,
                          maxQuantity: parseInt(e.target.value),
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newAddon.description}
                    onChange={(e) =>
                      setNewAddon((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Service description"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAddon}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Service
                </button>
              </div>
              {formData.addons.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Added Services
                  </h3>
                  <div className="space-y-3">
                    {formData.addons.map((addon, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {addon.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {addon.description}
                          </p>
                          <p className="text-sm font-semibold text-indigo-600">
                            ₹{addon.price} (Max: {addon.maxQuantity})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddon(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Location
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="location.fullAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Address *
                  </label>
                  <input
                    id="location.fullAddress"
                    name="location.fullAddress"
                    type="text"
                    value={formData.location.fullAddress}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="location.city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City *
                    </label>
                    <input
                      id="location.city"
                      name="location.city"
                      type="text"
                      value={formData.location.city}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location.state"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      State *
                    </label>
                    <input
                      id="location.state"
                      name="location.state"
                      type="text"
                      value={formData.location.state}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location.pinCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      PIN Code *
                    </label>
                    <input
                      id="location.pinCode"
                      name="location.pinCode"
                      type="text"
                      value={formData.location.pinCode}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Availability
                </h2>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Generate Availability Slots
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      maxDate={addMonths(new Date(), 3)}
                      placeholderText="Select start date"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      maxDate={addMonths(new Date(), 3)}
                      placeholderText="Select end date"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAvailability}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Generate Slots
                </button>
              </div>
              {availability.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Edit Generated Availability
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {availability.map(({ dateKey, date, slots }) => (
                      <div
                        key={dateKey}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">
                            {format(date, "EEEE, MMMM d, yyyy")}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveDate(dateKey)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                            title="Remove this entire day"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.map(({ hour, isAvailable }) => (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => handleToggleSlot(dateKey, hour)}
                              className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                                isAvailable
                                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 line-through"
                              }`}
                            >
                              {formatHour(hour)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Upload className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Studio Images
                </h2>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Click to upload images
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB (max 5 images)
                  </p>
                </label>
              </div>
              {selectedImages.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/owner/studios")}
                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit for Approval"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudio;
