import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Mic } from 'lucide-react';
import useAuth from '../context/useAuth';
import Navbar from '../components/Navbar';

const VerifyOtp = () => {
  const location = useLocation();
  const { verifyOtp, loading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    emailOtp: '',
    phoneOtp: ''
  });
  const [errors, setErrors] = useState({});
  
  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Redirect if no email in state
  useEffect(() => {
    if (!location.state?.email) {
      // No email provided, redirect to signup
      return <Navigate to="/signup\" replace />;
    }
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.emailOtp) {
      newErrors.emailOtp = 'Email OTP is required';
    } else if (!/^\d+$/.test(formData.emailOtp)) {
      newErrors.emailOtp = 'OTP must contain only digits';
    }
    
    if (!formData.phoneOtp) {
      newErrors.phoneOtp = 'Phone OTP is required';
    } else if (!/^\d+$/.test(formData.phoneOtp)) {
      newErrors.phoneOtp = 'OTP must contain only digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await verifyOtp(formData);
      // Redirect is handled in the AuthContext
    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'OTP verification failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Mic className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Verify Your Account</h1>
          <p className="text-center text-gray-600 mb-6">
            We've sent OTP codes to your email and phone. Please enter them below to verify your account.
          </p>
          
          {errors.general && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="your@email.com"
                readOnly={!!location.state?.email}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700 mb-1">
                Email OTP
              </label>
              <input
                id="emailOtp"
                type="text"
                name="emailOtp"
                value={formData.emailOtp}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.emailOtp ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter email OTP"
              />
              {errors.emailOtp && (
                <p className="mt-1 text-sm text-red-600">{errors.emailOtp}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="phoneOtp" className="block text-sm font-medium text-gray-700 mb-1">
                Phone OTP
              </label>
              <input
                id="phoneOtp"
                type="text"
                name="phoneOtp"
                value={formData.phoneOtp}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.phoneOtp ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter phone OTP"
              />
              {errors.phoneOtp && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneOtp}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;