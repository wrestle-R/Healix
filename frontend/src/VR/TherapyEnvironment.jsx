import React from 'react';

const TherapyEnvironment = () => {
  return (
    <>
      {/* Simple Clean Walls */}
      <a-box 
        position="-8 2.5 0" 
        width="0.2" 
        height="5" 
        depth="16" 
        color="#FFFFFF"
        shadow="receive: true"
      ></a-box>
      <a-box 
        position="8 2.5 0" 
        width="0.2" 
        height="5" 
        depth="16" 
        color="#FFFFFF"
        shadow="receive: true"
      ></a-box>
      <a-box 
        position="0 2.5 -8" 
        width="16" 
        height="5" 
        depth="0.2" 
        color="#FFFFFF"
        shadow="receive: true"
      ></a-box>

      {/* Clean Ceiling */}
      <a-plane 
        position="0 5 0" 
        rotation="90 0 0" 
        width="16" 
        height="16" 
        color="#F8F9FA"
        shadow="receive: true"
      ></a-plane>

      {/* Simple Wall Text */}
      <a-text 
        position="0 3.5 -7.8" 
        value="PHYSICAL THERAPY CENTER" 
        align="center" 
        color="#2E86AB"
        scale="2 2 2"
        font="roboto"
      ></a-text>
    </>
  );
};

export default TherapyEnvironment;