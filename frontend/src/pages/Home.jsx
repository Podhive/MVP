import React from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  Calendar,
  Star,
  Users,
  ArrowRight,
  Play,
  Shield,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import useAuth from "../context/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Professional
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Podcast Studios
                </span>
                Near You
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100 leading-relaxed">
                Discover, book, and record in top-quality podcast studios.
                Perfect for creators, professionals, and podcasters of all
                levels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/studios"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse Studios
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                {!isAuthenticated() && (
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg"
                  alt="Professional Podcast Studio"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PodHive?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make it easy to find and book professional podcast studios with
              everything you need for a perfect recording session.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Professional Equipment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access high-quality microphones, mixers, and acoustic treatment
                for crystal-clear recordings that sound professional.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Flexible Booking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Book morning, afternoon, or evening slots that fit your
                schedule, with transparent pricing and instant confirmation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Verified Reviews
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Read authentic reviews from real podcasters to find the perfect
                studio that meets your specific recording needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Secure Payments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Choose to pay online securely or at the studio. Your booking is
                protected with our secure payment system.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                24/7 Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get help whenever you need it with our dedicated support team
                available around the clock for all your needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Community Driven
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join a community of podcasters and studio owners working
                together to create amazing content and experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Studios Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Recording?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of podcasters who trust PodHive to find the perfect
            studio for their recording needs. Start your podcasting journey
            today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/studios"
              className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Mic className="mr-2 h-5 w-5" />
              Find a Studio
            </Link>
            {!isAuthenticated() && (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-8 py-4 rounded-xl border-2 border-white hover:bg-white hover:text-indigo-600 transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                Join as Owner
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Mic className="h-8 w-8 mr-3 text-indigo-400" />
                <span className="text-2xl font-bold">PodHive</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The premier platform for booking professional podcast studios.
                Connect creators with amazing spaces to bring their stories to
                life.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/studios"
                    className="hover:text-white transition-colors"
                  >
                    Browse Studios
                  </Link>
                </li>
                {!isAuthenticated() && (
                  <>
                    <li>
                      <Link
                        to="/signup"
                        className="hover:text-white transition-colors"
                      >
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="hover:text-white transition-colors"
                      >
                        Login
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} PodHive. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
