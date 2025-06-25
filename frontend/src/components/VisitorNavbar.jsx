import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-green-400">
            HealthCare+
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-green-400 transition-colors duration-200">
              Home
            </a>
            <a href="#services" className="hover:text-green-400 transition-colors duration-200">
              Services
            </a>
            <a href="#doctors" className="hover:text-green-400 transition-colors duration-200">
              Doctors
            </a>
            <a href="#about" className="hover:text-green-400 transition-colors duration-200">
              About
            </a>
            <a href="#contact" className="hover:text-green-400 transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
              Book Appointment
            </button>
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
              <a href="#home" className="hover:text-green-400 transition-colors duration-200">
                Home
              </a>
              <a href="#services" className="hover:text-green-400 transition-colors duration-200">
                Services
              </a>
              <a href="#doctors" className="hover:text-green-400 transition-colors duration-200">
                Doctors
              </a>
              <a href="#about" className="hover:text-green-400 transition-colors duration-200">
                About
              </a>
              <a href="#contact" className="hover:text-green-400 transition-colors duration-200">
                Contact
              </a>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 mt-3 w-fit">
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
