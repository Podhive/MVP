import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Navbar from '../components/Navbar';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/"
              className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
            >
              Go to Home
            </Link>
            <Link 
              to="/studios"
              className="block w-full bg-white text-indigo-600 py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 text-center"
            >
              Browse Studios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;