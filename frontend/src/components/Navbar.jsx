import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../context/useAuth";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "owner") return "/dashboard/owner";
    return "/dashboard/customer";
  };

  // Determine user type for conditional rendering
  const isContentCreator = isAuthenticated() && role === "customer";

  return (
    <nav className="bg-gradient-to-br from-[#020610] to-indigo-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo with white text */}
            <Link to="/" className="flex items-center group">
              <img
                src="/images/logo2.png"
                alt="PodHive Logo"
                className="h-16 w-auto mr-1 rounded-lg"
              />
              <span className="text-2xl font-bold text-white">PodHive</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {(!isAuthenticated() || isContentCreator) && (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  About Us
                </Link>
              </>
            )}

            <Link
              to="/studios"
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
            >
              Studios
            </Link>

            {isAuthenticated() ? (
              <>
                {isContentCreator && (
                  <Link
                    to="/add-your-studio"
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  >
                    Setup Your Studio
                  </Link>
                )}
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-900 to-purple-900 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {(!isAuthenticated() || isContentCreator) && (
              <>
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
              </>
            )}
            <Link
              to="/studios"
              className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Studios
            </Link>

            {isAuthenticated() ? (
              <>
                {isContentCreator && (
                  <Link
                    to="/add-your-studio"
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Setup Your Studio
                  </Link>
                )}
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium mx-3 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
