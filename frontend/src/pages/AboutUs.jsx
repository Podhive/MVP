import React, { useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  const [openBlogIndex, setOpenBlogIndex] = useState(null);

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
      name: "Tanishq Vats",
      role: "Software Developer Intern",
      description:
        "Software developer responsible for building and maintaining Podhive’s platform.",
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

  const blogs = [
    {
      title:
        "Why Podcasting is Exploding in India (And How to Get Started Today)",
      introduction:
        "Podcasting has gone from a niche hobby to a booming industry in India. With affordable internet, increasing smartphone usage, and growing interest in audio-first content, India has become the world’s third-largest podcast market, behind only the U.S. and China. For aspiring creators, now is the perfect time to launch a podcast — but doing it right requires more than just a mic at home. That’s where professional podcast studios and platforms like PodHive come in.",
      sections: [
        {
          heading: "1. The Rise of Podcasting in India",
          points: [
            "India’s podcast listener base is projected to cross 200 million by 2026.",
            "Spotify India, Gaana, JioSaavn, and Audible have made podcast streaming easy.",
            "Urban youth, professionals, and regional creators are driving this boom.",
            "Topics trending in India: comedy, wellness, business, spirituality, and education.",
          ],
        },
        {
          heading: "2. Why Start a Podcast?",
          points: [
            "Personal Branding: Build authority in your field.",
            "Content Marketing: Brands use podcasts to connect with audiences deeply.",
            "Monetization: Ads, sponsorships, and paid subscriptions are growing.",
            "Regional Advantage: Regional-language podcasts are exploding, with Hindi, Tamil, and Bengali leading.",
          ],
        },
        {
          heading: "3. Challenges Indian Podcasters Face",
          points: [
            "Poor soundproofing in home setups.",
            "Lack of professional microphones and mixers.",
            "Difficulty finding verified studios with transparent pricing.",
            "Editing and post-production expertise.",
          ],
        },
        {
          heading: "4. How PodHive Solves These Issues",
          points: [
            "Access to verified podcast studios in Delhi NCR and soon pan-India.",
            "Transparent pricing with options for budget, elite, and premium studios.",
            "Flexible weekday/weekend packages, with or without equipment.",
            "Add-on services like editing, video reels, and thumbnails.",
          ],
        },
        {
          heading: "5. Steps to Start Your Podcast (with PodHive)",
          points: [
            "Define your niche and audience.",
            "Book a studio on PodHive in just a few clicks.",
            "Record with professional-grade equipment.",
            "Use PodHive’s add-on services for editing and marketing.",
            "Publish on Spotify, Apple Podcasts, and YouTube.",
          ],
        },
      ],
      conclusion:
        "Podcasting in India is not just a trend — it’s a movement. If you want to be heard, now is the best time to start. With PodHive’s one-stop platform, launching your podcast is simple, professional, and stress-free.",
    },
    {
      title: "Top 5 Things to Look for in a Podcast or Recording Studio",
      introduction:
        "If you’re serious about creating high-quality content — whether it’s a podcast, music recording, or video shoot — the studio you choose matters. A professional studio ensures not just quality but also comfort, efficiency, and trust. Here are the top 5 things to look for when booking a podcast or recording studio in India.",
      sections: [
        {
          heading: "1. Soundproofing & Acoustics",
          points: [
            "Good studios invest in acoustic panels, foam, and isolation booths.",
            "This prevents echoes, outside noise, and distortion.",
            "Why it matters: listeners won’t tolerate poor audio, even if your content is great.",
          ],
        },
        {
          heading: "2. Professional Equipment",
          points: [
            "Microphones: Condenser mics like Shure, Rode, and Audio-Technica.",
            "Mixing Consoles: For balancing sound quality.",
            "Camera Setups: Multi-cam angles for YouTube podcasts.",
            "Lighting: Softbox or LED setups for video podcasts.",
          ],
        },
        {
          heading: "3. Flexible Packages",
          points: [
            "Many creators don’t need all the equipment.",
            "Studios should offer packages with and without equipment.",
            "PodHive already enables custom packages, weekday vs. weekend rates, and flexible durations (2, 4, 6 hours).",
          ],
        },
        {
          heading: "4. Accessibility & Location",
          points: [
            "Easy parking, metro connectivity, and central locations matter.",
            "Creators lose time if the studio is too far or hard to find.",
          ],
        },
        {
          heading: "5. Verified Studios & Transparent Pricing",
          points: [
            "Avoid hidden charges — overtime, equipment add-ons, cancellation fees.",
            "Verified studios with watermarked photos (like PodHive ensures) build trust.",
          ],
        },
      ],
      conclusion:
        "Before booking a podcast or recording studio, check for soundproofing, equipment, flexibility, location, and trustworthiness. PodHive ensures all these criteria are met, making it India’s most reliable podcast studio aggregator.",
    },
    {
      title:
        "The Future of Content Creation in India – Why Studios Are the Next Big Thing",
      introduction:
        "India is witnessing a creator economy revolution. From YouTubers to podcasters, from indie musicians to influencers, everyone is producing content. But as creators scale, home setups fall short. The future lies in professional studios that combine affordability, flexibility, and quality.",
      sections: [
        {
          heading: "1. India’s Creator Economy Boom",
          points: [
            "Over 100 million creators in India, with YouTube and Instagram leading.",
            "Podcasts are growing at 30% YoY.",
            "Brands are spending more on influencer-driven campaigns.",
          ],
        },
        {
          heading: "2. Why Home Setups Are Not Enough",
          points: [
            "Background noise, poor video lighting, limited bandwidth.",
            "Lack of professional editing tools.",
            "Reduced credibility when collaborating with brands.",
          ],
        },
        {
          heading: "3. Studios as a Service: The Next Big Shift",
          points: [
            "Just like coworking spaces changed offices, studio rentals are changing content creation.",
            "Pay-per-use model means creators don’t need to buy expensive gear.",
            "Flexibility: choose just the space, or space + equipment.",
          ],
        },
        {
          heading: "4. Why Delhi NCR is the Starting Point",
          points: [
            "Delhi NCR has one of India’s fastest-growing creator ecosystems.",
            "High density of brands, agencies, and creators.",
            "PodHive is bringing them together under one platform.",
          ],
        },
        {
          heading: "5. PodHive’s Role in India’s Content Future",
          points: [
            "Aggregates verified podcast & recording studios across India.",
            "Provides clear categories (Budget, Elite, Premium).",
            "Offers flexible packages + add-on services like editing, reels, and marketing.",
            "Builds trust with watermarked studio photos and transparent cancellation policies.",
          ],
        },
        {
          heading: "6. What This Means for Creators",
          points: [
            "Scalability: You can book bigger spaces as your brand grows.",
            "Professionalism: Brands prefer creators who work in professional setups.",
            "Monetization: Better quality = better reach = more sponsorships.",
          ],
        },
      ],
      conclusion:
        "The creator economy in India is moving from casual to professional. Studios are no longer a luxury; they are becoming a necessity. With PodHive, creators can access India’s best studios in just a few clicks — affordable, transparent, and professional.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-900 rounded-full mb-6">
            <Mic className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Us – PodHive Studios
          </h1>
          <p className="text-2xl text-indigo-900 font-semibold max-w-4xl mx-auto">
            India's First Studio Aggregator & Booking Platform
          </p>
        </div>

        {/* How PodHive Started */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How PodHive Started
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>
              In early 2024, PodHive began as a response to a simple but
              frustrating problem: our founder couldn't book a professional
              studio without getting ghosted, rescheduled, or juggled between
              multiple WhatsApp chats.
            </p>
            <p>
              It was chaos — studios were scattered across Instagram, pricing
              was inconsistent, and creators had no easy way to compare,
              confirm, or book.
            </p>
            <p>
              That's when the idea hit:{" "}
              <strong>
                Why isn't there an aggregator platform for studios?
              </strong>
            </p>
            <p className="text-indigo-900 font-semibold">
              PodHive was created to fix that — by building the simplest, most
              reliable way to discover and book studio spaces in India.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 text-white mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <div className="text-xl leading-relaxed">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What We're Building
          </h2>
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
                  <div className="bg-indigo-900 p-3 rounded-lg w-fit mb-4">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Vision</h2>
          <p className="text-xl text-gray-700 mb-6">
            PodHive aims to become India's go-to platform for audio and video
            creators.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Meet the Team
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            PodHive is driven by a young, passionate team who understand the
            creator journey:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-indigo-900 p-4 rounded-full w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-indigo-900 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOG SECTION - UPDATED STYLING */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            From the PodHive Blog
          </h2>
          <div className="space-y-4">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  onClick={() =>
                    setOpenBlogIndex(openBlogIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  <span className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {blog.title}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 text-indigo-500 transform transition-transform duration-300 ${
                      openBlogIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openBlogIndex === index ? "max-h-[3000px] pb-6" : "max-h-0"
                  }`}
                >
                  <div className="text-gray-700 leading-relaxed space-y-6">
                    <p className="text-base md:text-lg">{blog.introduction}</p>
                    {blog.sections.map((section, sIndex) => (
                      <div key={sIndex}>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mt-6 mb-3">
                          {section.heading}
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {section.points.map((point, pIndex) => (
                            <li key={pIndex} className="text-gray-600">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p className="text-base md:text-lg mt-8 font-semibold text-indigo-900">
                      {blog.conclusion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Want to Work With Us */}
        <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Work With Us?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Whether you're a creator, a studio owner, or someone with a spare
            room to convert into a micro studio, PodHive is your launchpad.
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
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-lg"
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
