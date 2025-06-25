import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, auth } from '../../../firebase.config.js';

const PatientNavbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-green-400">
            HealthCare+ <span className="text-sm text-gray-400">Patient Portal</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#appointments" className="hover:text-green-400 transition-colors duration-200">
              Appointments
            </a>
            <a href="#medical-records" className="hover:text-green-400 transition-colors duration-200">
              Medical Records
            </a>
            <a href="#doctors" className="hover:text-green-400 transition-colors duration-200">
              Find Doctors
            </a>
            <a href="#profile" className="hover:text-green-400 transition-colors duration-200">
              Profile
            </a>
            
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.displayName || 'Patient'}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <a href="#appointments" className="hover:text-green-400 transition-colors duration-200">
                Appointments
              </a>
              <a href="#medical-records" className="hover:text-green-400 transition-colors duration-200">
                Medical Records
              </a>
              <a href="#doctors" className="hover:text-green-400 transition-colors duration-200">
                Find Doctors
              </a>
              <a href="#profile" className="hover:text-green-400 transition-colors duration-200">
                Profile
              </a>
              <div className="pt-3 border-t border-gray-700">
                <p className="text-gray-300 mb-2">Welcome, {user?.displayName || 'Patient'}</p>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PatientNavbar;
