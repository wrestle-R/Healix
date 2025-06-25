import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, auth } from '../../firebase.config.js';
import PatientNavbar from '../components/Patient/PatientNavbar.jsx';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <PatientNavbar user={user} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.displayName || 'Patient'}!
          </h1>
          <p className="text-gray-400">Manage your health and appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📅</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Next Appointment</h3>
                <p className="text-gray-400">Tomorrow, 10:00 AM</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">💊</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Medications</h3>
                <p className="text-gray-400">3 Active prescriptions</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Health Score</h3>
                <p className="text-gray-400">85% - Good</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white">✓</span>
              </div>
              <div>
                <h4 className="text-white font-medium">Appointment Completed</h4>
                <p className="text-gray-400 text-sm">Checkup with Dr. Smith - 2 days ago</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white">📄</span>
              </div>
              <div>
                <h4 className="text-white font-medium">Lab Results Available</h4>
                <p className="text-gray-400 text-sm">Blood work results from last week</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white">⏰</span>
              </div>
              <div>
                <h4 className="text-white font-medium">Medication Reminder</h4>
                <p className="text-gray-400 text-sm">Take morning medication at 8:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
