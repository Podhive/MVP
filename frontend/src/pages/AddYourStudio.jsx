import React, { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  Mic,
  Home,
  Camera,
  DollarSign,
  CheckCircle,
  Phone,
  MapPin,
  User,
  MessageCircle,
} from "lucide-react";
import { submitStudioInquiry } from "../api";

const AddYourStudio = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    location: "",
    hasRoom: "yes",
    needsHelp: "yes",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.whatsapp || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitStudioInquiry(formData); //
      toast.success(
        "Thank you! We'll contact you within 24 hours with your studio starter plan."
      );
      setFormData({
        name: "",
        whatsapp: "",
        location: "",
        hasRoom: "yes",
        needsHelp: "yes",
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const earningData = [
    { type: "10 sessions/day @ ₹2500", earning: "-" },
    { type: "200 sessions/month", earning: "₹500,000+" },
    {
      type: "Add-on reels or editing upsells",
      earning: "More revenue potential",
    },
  ];

  const features = [
    {
      icon: Home,
      title: "Simple room setup plan",
      description:
        "No construction needed, just smart arrangement of what you already have.",
    },
    {
      icon: Mic,
      title: "Mic & lighting recommendations",
      description:
        "Budget-friendly equipment suggestions tailored to your space.",
    },
    {
      icon: Camera,
      title: "Sample layouts + decor tips",
      description: "Visual guides to make your space attractive to creators.",
    },
    {
      icon: CheckCircle,
      title: "Booking management",
      description: "We handle scheduling and payments so you don't have to.",
    },
  ];

  const targetAudience = [
    {
      title: "Flat owners & landlords",
      description:
        "With extra rooms or unused spaces that could generate income.",
    },
    {
      title: "Photographers",
      description:
        "With underused shooting spaces that can double as podcast studios.",
    },
  ];

  const exampleStudios = [
    {
      title: "Cozy Home Corner Studio",
      image:
        "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg",
      description: "Home podcast setup",
    },
    {
      title: "Converted Spare Room",
      image:
        "https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg",
      description: "Small studio setup",
    },
    {
      title: "Café Corner Setup",
      image:
        "https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg",
      description: "Café corner studio",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6">
            <Mic className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Turn Your Room Into a Podcast Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Earn money from your unused space by renting it out to creators,
            podcasters, and students — we'll help you set it up. Start Now –
            It's Free.
          </p>
        </div>

        {/* Why This Works */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why This Works
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              India's podcast scene is booming. Creators are looking for places
              to record — but good studios are rare.
            </p>
            <p className="mb-6">
              If you have a spare room, quiet corner, or unused shop space, you
              can:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 text-center">
                <div className="text-2xl mb-2"></div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Set up a basic podcast studio
                </h3>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 text-center">
                <div className="text-2xl mb-2"></div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Get bookings through PodHive
                </h3>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 text-center">
                <div className="text-2xl mb-2"></div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Earn ₹4,00,000–₹5,00,000/month
                </h3>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 text-center">
                <div className="text-2xl mb-2"></div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Scale your business
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* We Help You Set It Up */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-3xl font-bold mb-6"> We Help You Set It Up</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Don't worry about the tech. We guide you with:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                >
                  <div className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-lg mr-4 flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-indigo-100 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <p className="text-xl font-semibold">
              You focus on the space. We'll handle the creators.
            </p>
          </div>
        </div>

        {/* What You Can Earn */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              What You Can Earn
            </h2>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <th className="border border-green-200 p-4 text-left font-semibold text-gray-900">
                    Booking Type
                  </th>
                  <th className="border border-green-200 p-4 text-left font-semibold text-gray-900">
                    You Earn
                  </th>
                </tr>
              </thead>
              <tbody>
                {earningData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-4 text-gray-700">
                      {row.type}
                    </td>
                    <td className="border border-gray-200 p-4 font-semibold text-green-600">
                      {row.earning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <p className="text-gray-700 text-center">
              <strong>
                (You set your own schedule – rent by hour, day, or weekend)
              </strong>
            </p>
          </div>
        </div>

        {/* See Example Studios */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            See Example Studios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exampleStudios.map((studio, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {studio.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{studio.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who This Is For */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Who This Is For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {targetAudience.map((audience, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-purple-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {audience.title}
                </h3>
                <p className="text-gray-600">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* List Your Space Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            List Your Space – Get Started Now
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Your WhatsApp number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location (City/Area) *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., Mumbai, Andheri"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you already have a room? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasRoom"
                      value="yes"
                      checked={formData.hasRoom === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasRoom"
                      value="no"
                      checked={formData.hasRoom === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Would you like help with setup? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="needsHelp"
                      value="yes"
                      checked={formData.needsHelp === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="needsHelp"
                      value="no"
                      checked={formData.needsHelp === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  Submitting...
                </div>
              ) : (
                "Start Setup"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              We'll contact you within 24 hours with your studio starter plan.
            </p>
          </div>
        </div>

        {/* Still Thinking */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Still Thinking?</h2>
          <p className="text-xl text-indigo-100 mb-2">
            PodHive partners earn money while empowering creators.
          </p>
          <p className="text-lg text-indigo-100 mb-8">
            No tenants. No hassle. Just bookings.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddYourStudio;
