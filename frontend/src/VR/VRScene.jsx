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
      console.log('A-Frame loaded - ALL GLB models ready!');
    }
  }, []);

  return (
    <a-scene 
      vr-mode-ui="enabled: true" 
      embedded 
      style={{ height: '100vh', width: '100vw' }}
      background="color: #87CEEB"
      shadow="type: pcf; shadowMapWidth: 2048; shadowMapHeight: 2048"
    >
      {/* Assets - ALL YOUR GLB MODELS! */}
      <a-assets>
        <a-asset-item 
          id="arms-up-model" 
          src="/models/Arms_Up.glb"
        ></a-asset-item>
        
        <a-asset-item 
          id="squat-model" 
          src="/models/Squat.glb"
        ></a-asset-item>
        
        <a-asset-item 
          id="stand-model" 
          src="/models/Stand.glb"
        ></a-asset-item>
        
        <audio id="success-sound" src="/sounds/success.mp3" preload="auto"></audio>
      </a-assets>

      {/* Lighting */}
      <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
      <a-light type="directional" position="5 10 5" intensity="0.8" shadow="cast: true"></a-light>

      {/* Environment */}
      <TherapyEnvironment />

      {/* Professional Mixamo GLB Instructor! */}
      <ExerciseInstructor exercise={exercise} currentStep={currentStep} isActive={isActive} />

      {/* Exercise Area */}
      <ExerciseArea exercise={exercise} isActive={isActive} onRepComplete={onRepComplete} />

      {/* Camera and Controls */}
      <a-entity id="cameraRig" position="0 1.6 3">
        <a-camera look-controls="enabled: true" wasd-controls="enabled: true" cursor="rayOrigin: mouse; fuse: false"></a-camera>
        <a-entity id="leftHand" hand-controls="hand: left; handModelStyle: lowPoly; color: #15803D" laser-controls="maxDistance: 10; lineColor: #15803D" raycaster="objects: .clickable"></a-entity>
        <a-entity id="rightHand" hand-controls="hand: right; handModelStyle: lowPoly; color: #DC2626" laser-controls="maxDistance: 10; lineColor: #DC2626" raycaster="objects: .clickable"></a-entity>
      </a-entity>

      {/* Floor */}
      <a-plane id="floor" position="0 0 0" rotation="-90 0 0" width="20" height="20" color="#E8F5E8" shadow="receive: true"></a-plane>

      {/* Grid */}
      <a-entity>
        {[...Array(5)].map((_, i) => (
          <a-plane key={`grid-${i}`} position={`${(i-2)*3} 0.01 0`} rotation="-90 0 0" width="0.1" height="20" color="#C8E6C9" opacity="0.3"></a-plane>
        ))}
      </a-entity>
    </a-scene>
  );
};

export default VRScene;