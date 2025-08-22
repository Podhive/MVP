import React from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  Target,
  Eye,
  Users,
  Mail,
  MapPin,
  Globe,
  Star,
  Zap,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Abhishek Bhandari",
      role: "Founder, Product & Partnerships",
      description:
        "Visionary behind PodHive and lead on strategy, features, and collaborations.",
      icon: Target,
    },
    {
      name: "Leji Joseph",
      role: "Co-founder, Operations & Outreach",
      description:
        "Manages day-to-day operations, user experience, and content creator support.",
      icon: Users,
    },
    {
      name: "Jaikishan Mandal",
      role: "Lead, Studio Partnerships & Growth",
      description:
        "Heads outreach and onboarding of verified studios, building a strong supply-side network.",
      icon: TrendingUp,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Browse Studios",
      description: "By location, price, or setup",
    },
    {
      icon: Target,
      title: "Instant Booking",
      description: "No DMs or delayed responses",
    },
    {
      icon: Star,
      title: "Add-on Services",
      description: "Camera packages, editing, teasers, reels",
    },
    {
      icon: Heart,
      title: "Student-Friendly",
      description: "Pricing starting at just ₹899",
    },
    {
      icon: Award,
      title: "Studio Conversion",
      description: "Help convert rooms into studios",
    },
    {
      icon: TrendingUp,
      title: "Monetization",
      description: "Help owners gain visibility and revenue",
    },
  ];

  const visionGoals = [
    "Onboard 500+ studios across Indian metros",
    "Offer AI-based editing and automation tools for creators",
    "Deploy mobile podcast kits for plug-and-play studio setups",
    "Create a trusted marketplace for creators, brands, and studios",
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
            About Us – PodHive Studios
          </h1>
          <p className="text-2xl text-indigo-600 font-semibold max-w-4xl mx-auto">
            India's First Studio Aggregator & Booking Platform
          </p>
        </div>

        {/* How PodHive Started */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              How PodHive Started
            </h2>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              In early 2024, PodHive began as a response to a simple but
              frustrating problem: our founder couldn't book a professional
              studio without getting ghosted, rescheduled, or juggled between
              multiple WhatsApp chats.
            </p>
            <p className="mb-4">
              It was chaos — studios were scattered across Instagram, pricing
              was inconsistent, and creators had no easy way to compare,
              confirm, or book.
            </p>
            <p className="mb-4">
              That's when the idea hit:{" "}
              <strong>
                Why isn't there an aggregator platform for studios?
              </strong>
            </p>
            <p className="text-indigo-600 font-semibold">
              PodHive was created to fix that — by building the simplest, most
              reliable way to discover and book studio spaces in India.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>

          <div className="text-xl leading-relaxed mb-6">
            <p className="mb-4">
              <strong>
                Making podcasting and recording accessible and effortless for
                everyone with a voice.
              </strong>
            </p>
            <p className="mb-4">
              We believe that stories, ideas, and conversations deserve a space
              — and no one should be held back due to lack of access or
              affordability.
            </p>
            <p className="text-indigo-100">
              Whether you're a student with a smartphone, a founder building a
              brand, or a full-time creator, PodHive helps you find the right
              studio in seconds.
            </p>
          </div>
        </div>

        {/* What We're Building */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              What We're Building
            </h2>
          </div>

          <p className="text-xl text-gray-700 mb-8">
            PodHive is not just a listing site. It's a platform built for
            creators, designed to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
            <p className="text-gray-700 text-lg">
              We're starting with <strong>Delhi NCR</strong> and plan to expand
              across India in the coming year.
            </p>
          </div>
        </div>

        {/* Our Vision */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
          </div>

          <p className="text-xl text-gray-700 mb-6">
            PodHive aims to become India's go-to platform for audio and video
            creators.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              By 2026, we want to:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visionGoals.map((goal, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
          </div>

          <p className="text-xl text-gray-700 mb-8">
            PodHive is driven by a young, passionate team who understand the
            creator journey:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <p className="text-gray-700 text-center">
              Web application designed, developed, deployed, and managed by
              Tanishq Vats.
            </p>
          </div>
        </div>

        {/* Want to Work With Us */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Work With Us?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Whether you're a creator, a studio owner, or someone with a spare
            room to convert into a micro studio, PodHive is your launchpad.
          </p>
          <p className="text-lg text-indigo-100 mb-8">
            Book your first studio, join our platform, or bring your idea to
            life with the power of voice.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Mail className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-indigo-100">care.podhive@gmail.com</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Globe className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Website</h3>
              <p className="text-indigo-100">www.podhive.in</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Headquartered in</h3>
              <p className="text-indigo-100">Faridabad, Delhi NCR</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/studios"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-lg"
            >
              <Mic className="h-5 w-5 mr-2" />
              Browse Studios
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors font-semibold border border-white/20"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            © 2025 PodHive Studios. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
