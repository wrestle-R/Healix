import React, { useEffect } from 'react';
import 'aframe';
import 'aframe-extras';
import 'aframe-environment-component';
import TherapyEnvironment from './TherapyEnvironment';
import ExerciseInstructor from './ExerciseInstructor';
import ExerciseArea from './ExerciseArea';

const VRScene = ({ exercise, currentStep, isActive, onRepComplete }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AFRAME) {
      console.log('VR Therapy Room - Ready!');
    }
  }, []);

  return (
    <a-scene 
      vr-mode-ui="enabled: true" 
      embedded 
      style={{ height: '100vh', width: '100vw' }}
      background="color: #E8F4FD"
      shadow="type: pcf; shadowMapWidth: 2048; shadowMapHeight: 2048"
    >
      {/* Assets */}
      <a-assets>
        <a-asset-item id="arms-up-model" src="/models/Arms_Up.glb"></a-asset-item>
        <a-asset-item id="squat-model" src="/models/Squat.glb"></a-asset-item>
        <a-asset-item id="stand-model" src="/models/Stand.glb"></a-asset-item>
        <audio id="success-sound" src="/sounds/success.mp3" preload="auto"></audio>
      </a-assets>

      {/* Professional Lighting Setup */}
      <a-light type="ambient" color="#ffffff" intensity="0.4"></a-light>
      <a-light 
        type="directional" 
        position="8 10 8" 
        intensity="0.8"
        color="#ffffff"
        shadow="cast: true"
      ></a-light>
      <a-light 
        type="point" 
        position="0 4 0" 
        intensity="0.3"
        color="#87CEEB"
      ></a-light>

      {/* Modern Therapy Environment */}
      <TherapyEnvironment />

      {/* Professional Instructor */}
      <ExerciseInstructor exercise={exercise} currentStep={currentStep} isActive={isActive} />

      {/* Exercise Area */}
      <ExerciseArea exercise={exercise} isActive={isActive} onRepComplete={onRepComplete} />

      {/* Camera Setup */}
      <a-entity id="cameraRig" position="0 1.6 3">
        <a-camera look-controls="enabled: true" wasd-controls="enabled: true" cursor="rayOrigin: mouse; fuse: false"></a-camera>
        <a-entity id="leftHand" hand-controls="hand: left; handModelStyle: lowPoly; color: #4CAF50" laser-controls="maxDistance: 10; lineColor: #4CAF50" raycaster="objects: .clickable"></a-entity>
        <a-entity id="rightHand" hand-controls="hand: right; handModelStyle: lowPoly; color: #2196F3" laser-controls="maxDistance: 10; lineColor: #2196F3" raycaster="objects: .clickable"></a-entity>
      </a-entity>

      {/* Beautiful Wooden Floor */}
      <a-plane 
        id="floor" 
        position="0 0 0" 
        rotation="-90 0 0" 
        width="16" 
        height="16" 
        color="#F5E6D3"
        shadow="receive: true"
      ></a-plane>

      {/* Subtle Grid Pattern */}
      <a-entity>
        {[...Array(4)].map((_, i) => (
          <a-plane 
            key={`grid-x-${i}`}
            position={`${(i-2)*4} 0.01 0`} 
            rotation="-90 0 0" 
            width="0.05" 
            height="16" 
            color="#E0E0E0"
            opacity="0.2"
          ></a-plane>
        ))}
        {[...Array(4)].map((_, i) => (
          <a-plane 
            key={`grid-z-${i}`}
            position={`0 0.01 ${(i-2)*4}`} 
            rotation="-90 0 0" 
            width="16" 
            height="0.05" 
            color="#E0E0E0"
            opacity="0.2"
          ></a-plane>
        ))}
      </a-entity>
    </a-scene>
  );
};

export default VRScene;