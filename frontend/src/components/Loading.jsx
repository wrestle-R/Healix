import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-6"></div>
        <div className="text-white text-xl font-light">{message}</div>
      </div>
    </div>
  );
};

export default Loading;
