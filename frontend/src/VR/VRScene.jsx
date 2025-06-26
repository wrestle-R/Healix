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

      {/* Simple Lighting */}
      <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
      <a-light type="directional" position="5 10 5" intensity="0.8" shadow="cast: true"></a-light>

      {/* Clean Environment */}
      <TherapyEnvironment />

      {/* Just the Model */}
      <ExerciseInstructor exercise={exercise} currentStep={currentStep} isActive={true} />

      {/* Clean Exercise Area */}
      <ExerciseArea exercise={exercise} isActive={true} onRepComplete={onRepComplete} />

      {/* Camera */}
      <a-entity id="cameraRig" position="0 1.6 3">
        <a-camera look-controls="enabled: true" wasd-controls="enabled: true" cursor="rayOrigin: mouse; fuse: false"></a-camera>
      </a-entity>

      {/* Simple Floor */}
      <a-plane 
        id="floor" 
        position="0 0 0" 
        rotation="-90 0 0" 
        width="20" 
        height="20" 
        color="#F5E6D3"
        shadow="receive: true"
      ></a-plane>
    </a-scene>
  );
};

export default VRScene;