import React from 'react';

const TherapyEnvironment = () => {
  return (
    <>
      {/* Walls */}
      <a-box 
        position="-10 2.5 0" 
        width="0.1" 
        height="5" 
        depth="20" 
        color="#E0E0E0"
      ></a-box>
      <a-box 
        position="10 2.5 0" 
        width="0.1" 
        height="5" 
        depth="20" 
        color="#E0E0E0"
      ></a-box>
      <a-box 
        position="0 2.5 -10" 
        width="20" 
        height="5" 
        depth="0.1" 
        color="#E0E0E0"
      ></a-box>

      {/* Ceiling */}
      <a-plane 
        position="0 5 0" 
        rotation="90 0 0" 
        width="20" 
        height="20" 
        color="#F5F5F5"
      ></a-plane>

      {/* Mirror on wall */}
      <a-plane 
        position="0 2 -9.9" 
        width="6" 
        height="3" 
        color="#87CEEB"
        opacity="0.7"
      ></a-plane>

      {/* Exercise Equipment */}
      <a-cylinder 
        position="5 1 -5" 
        radius="0.5" 
        height="2" 
        color="#FF6B6B"
      ></a-cylinder>
      <a-box 
        position="-5 0.5 -5" 
        width="2" 
        height="1" 
        depth="1" 
        color="#4ECDC4"
      ></a-box>
    </>
  );
};

export default TherapyEnvironment;