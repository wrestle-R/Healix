import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, auth } from '../../firebase.config.js';
import DoctorNavbar from '../components/Doctor/DoctorNavbar.jsx';

const DoctorDashboard = () => {
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
      <DoctorNavbar user={user} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, Dr. {user?.displayName || 'Doctor'}!
          </h1>
          <p className="text-gray-400">Manage your patients and appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">👥</span>
              </div>
              <h3 className="text-white text-2xl font-bold">48</h3>
              <p className="text-gray-400">Total Patients</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📅</span>
              </div>
              <h3 className="text-white text-2xl font-bold">12</h3>
              <p className="text-gray-400">Today's Appointments</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">💊</span>
              </div>
              <h3 className="text-white text-2xl font-bold">24</h3>
              <p className="text-gray-400">Prescriptions</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-white text-2xl font-bold">4.8</h3>
              <p className="text-gray-400">Rating</p>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">9AM</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">John Smith</h4>
                  <p className="text-gray-400 text-sm">General Checkup</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">10AM</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">Follow-up</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">11AM</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Mike Wilson</h4>
                  <p className="text-gray-400 text-sm">Consultation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Patients</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white">JS</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">John Smith</h4>
                  <p className="text-gray-400 text-sm">Last visit: 2 days ago</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white">SJ</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">Last visit: 1 week ago</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white">MW</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Mike Wilson</h4>
                  <p className="text-gray-400 text-sm">Last visit: 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
