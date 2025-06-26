import React from 'react';

const TherapyEnvironment = () => {
  return (
    <>
      {/* Modern Therapy Room Setup */}
      
      {/* Clean White Walls */}
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

      {/* Modern Ceiling with Soft Lighting */}
      <a-plane 
        position="0 5 0" 
        rotation="90 0 0" 
        width="16" 
        height="16" 
        color="#F8F9FA"
        shadow="receive: true"
      ></a-plane>

      {/* Motivational Wall Graphics */}
      <a-text 
        position="0 3.5 -7.8" 
        value="PHYSICAL THERAPY CENTER" 
        align="center" 
        color="#2E86AB"
        scale="2 2 2"
        font="roboto"
      ></a-text>
      
      <a-text 
        position="0 2.8 -7.8" 
        value="Your Journey to Recovery" 
        align="center" 
        color="#A23B72"
        scale="1.2 1.2 1.2"
        font="roboto"
      ></a-text>

      {/* Professional Equipment Area */}
      <a-cylinder 
        position="6 1 -5" 
        radius="0.3" 
        height="2" 
        color="#4CAF50"
        shadow="cast: true"
      ></a-cylinder>
      
      <a-box 
        position="-6 0.5 -5" 
        width="1.5" 
        height="1" 
        depth="0.8" 
        color="#2196F3"
        shadow="cast: true"
      ></a-box>

      {/* Comfortable Therapy Mats */}
      <a-plane 
        position="3 0.02 2" 
        rotation="-90 0 0" 
        width="2" 
        height="2" 
        color="#E8F5E8"
        opacity="0.8"
      ></a-plane>
      
      <a-plane 
        position="-3 0.02 2" 
        rotation="-90 0 0" 
        width="2" 
        height="2" 
        color="#E3F2FD"
        opacity="0.8"
      ></a-plane>

      {/* Ambient Decorations */}
      <a-sphere 
        position="5 3 -6" 
        radius="0.2" 
        color="#FFC107"
        animation="property: rotation; to: 0 360 0; dur: 20000; loop: true"
      ></a-sphere>
      
      <a-sphere 
        position="-5 3.5 -6" 
        radius="0.15" 
        color="#FF5722"
        animation="property: rotation; to: 0 -360 0; dur: 15000; loop: true"
      ></a-sphere>
    </>
  );
};

export default TherapyEnvironment;