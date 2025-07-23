import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mic,
  Calendar,
  User,
  LogOut,
  Settings,
  PlusCircle,
  List,
  Menu,
  X,
} from "lucide-react";
import useAuth from "../context/useAuth";

const Sidebar = () => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "bg-indigo-700" : "";
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const renderCustomerLinks = () => (
    <>
      <Link
        to="/studios"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/studios"
        )}`}
      >
        <Mic className="h-5 w-5 mr-3" />
        <span>Browse Studios</span>
      </Link>
      <Link
        to="/bookings/customer"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/bookings/customer"
        )}`}
      >
        <Calendar className="h-5 w-5 mr-3" />
        <span>My Bookings</span>
      </Link>
    </>
  );

  const renderOwnerLinks = () => (
    <>
      <Link
        to="/owner/studios"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/owner/studios"
        )}`}
      >
        <Mic className="h-5 w-5 mr-3" />
        <span>My Studios</span>
      </Link>
      <Link
        to="/owner/studios/new"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/owner/studios/new"
        )}`}
      >
        <PlusCircle className="h-5 w-5 mr-3" />
        <span>Add New Studio</span>
      </Link>
      <Link
        to="/owner/bookings"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/owner/bookings"
        )}`}
      >
        <Calendar className="h-5 w-5 mr-3" />
        <span>Bookings Received</span>
      </Link>
      {renderCustomerLinks()}
    </>
  );

  const renderAdminLinks = () => (
    <>
      <Link
        to="/admin/studios/pending"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/admin/studios/pending"
        )}`}
      >
        <List className="h-5 w-5 mr-3" />
        <span>Pending Studios</span>
      </Link>
      <Link
        to="/admin/bookings"
        onClick={handleLinkClick}
        className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
          "/admin/bookings"
        )}`}
      >
        <Calendar className="h-5 w-5 mr-3" />
        <span>All Bookings</span>
      </Link>
      {renderOwnerLinks()}
    </>
  );

  return (
    <div className="bg-indigo-800 text-white p-4 sticky top-0 z-50 flex items-center justify-between md:relative md:flex-col md:justify-start md:min-h-screen md:w-64">
      {/* Logo and Hamburger Menu Wrapper */}
      <div className="flex items-center justify-between w-full md:w-auto md:flex-col">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center md:justify-center md:mb-8 md:pt-4 hover:opacity-80 transition-opacity"
        >
          <Mic className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">PodHive</h1>
        </Link>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-indigo-700"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full bg-indigo-800 p-4 flex-col space-y-2 md:flex md:relative md:top-auto md:left-auto md:w-auto md:p-0 md:bg-transparent`}
      >
        <Link
          to={`/dashboard/${role}`}
          onClick={handleLinkClick}
          className={`flex items-center p-3 rounded-md hover:bg-indigo-700 ${isActive(
            `/dashboard/${role}`
          )}`}
        >
          <Home className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </Link>

        {role === "customer" && renderCustomerLinks()}
        {role === "owner" && renderOwnerLinks()}
        {role === "admin" && renderAdminLinks()}

        <button
          onClick={() => {
            handleLinkClick();
            logout();
          }}
          className="flex items-center p-3 rounded-md hover:bg-indigo-700 w-full text-left"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
