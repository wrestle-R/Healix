import React from 'react';
import 'aframe';
import TherapyEnvironment from './TherapyEnvironment';
import ExerciseInstructor from './ExerciseInstructor';
import ExerciseArea from './ExerciseArea';

const VRScene = ({ exercise, currentStep, isActive, onRepComplete }) => {
  return (
    <a-scene 
      vr-mode-ui="enabled: true" 
      embedded 
      style={{ height: '100vh', width: '100vw' }}
    >
      {/* Assets */}
      <a-assets>
        <a-asset-item id="instructor-model" src="/models/instructor.gltf"></a-asset-item>
        <img id="floor-texture" src="/textures/floor.jpg" />
        <img id="wall-texture" src="/textures/wall.jpg" />
      </a-assets>

      {/* Lighting */}
      <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
      <a-light type="directional" position="0 10 5" intensity="0.8"></a-light>

      {/* Environment */}
      <TherapyEnvironment />

      {/* Exercise Instructor */}
      <ExerciseInstructor 
        exercise={exercise}
        currentStep={currentStep}
        isActive={isActive}
      />

      {/* Exercise Area */}
      <ExerciseArea 
        exercise={exercise}
        isActive={isActive}
        onRepComplete={onRepComplete}
      />

      {/* Camera and Controls */}
      <a-entity id="cameraRig" position="0 1.6 3">
        <a-camera 
          look-controls="enabled: true"
          wasd-controls="enabled: true"
          cursor="rayOrigin: mouse"
        ></a-camera>
        <a-entity 
          id="leftHand"
          hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc"
        ></a-entity>
        <a-entity 
          id="rightHand"
          hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc"
        ></a-entity>
      </a-entity>

      {/* Floor */}
      <a-plane 
        position="0 0 0" 
        rotation="-90 0 0" 
        width="20" 
        height="20" 
        color="#7BC8A4"
        shadow="receive: true"
      ></a-plane>
    </a-scene>
  );
};

export default VRScene;