import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/VisitorNavbar';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Your Health, Our Priority
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional medical care with compassionate service. 
            Book your appointment today and take the first step towards better health.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="border-2 border-green-400 text-green-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-400 hover:text-black transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-gray-900">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-lg shadow-lg text-center border border-gray-800">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🩺</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">General Checkup</h4>
              <p className="text-gray-400">Comprehensive health assessments and preventive care</p>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-lg text-center border border-gray-800">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💊</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Specialized Care</h4>
              <p className="text-gray-400">Expert specialists for all your medical needs</p>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-lg text-center border border-gray-800">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏥</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Emergency Care</h4>
              <p className="text-gray-400">24/7 emergency medical services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">HealthCare+</h3>
          <p className="text-gray-300 mb-4">Providing quality healthcare since 2020</p>
          <div className="flex justify-center space-x-6">
            <span className="text-gray-300">📞 (555) 123-4567</span>
            <span className="text-gray-300">📧 info@healthcare.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

