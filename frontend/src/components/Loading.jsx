import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl font-light">{message}</div>
      </div>
    </div>
  );
};

export default Loading;
