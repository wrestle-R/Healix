import React, { useEffect } from 'react';
import 'aframe';
import 'aframe-extras';
import 'aframe-environment-component';
import TherapyEnvironment from './TherapyEnvironment';
import ExerciseInstructor from './ExerciseInstructor';
import ExerciseArea from './ExerciseArea';

const VRScene = ({ exercise, currentStep, isActive, onRepComplete }) => {
  useEffect(() => {
    // Register custom click handler for A-Frame
    if (typeof window !== 'undefined' && window.AFRAME) {
      console.log('A-Frame loaded successfully');
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
      {/* Assets */}
      <a-assets>
        {/* Ready Player Me Avatar */}
        <a-asset-item 
          id="avatar-model" 
          src="https://models.readyplayer.me/685c3742f3e9ba0f88c194ec.glb"
        ></a-asset-item>
        
        <img id="floor-texture" src="/textures/floor.jpg" />
        <img id="wall-texture" src="/textures/wall.jpg" />
        
        {/* Sounds */}
        <audio id="success-sound" src="/sounds/success.mp3" preload="auto"></audio>
        <audio id="start-sound" src="/sounds/start.mp3" preload="auto"></audio>
      </a-assets>

      {/* Enhanced Lighting */}
      <a-light 
        type="ambient" 
        color="#ffffff" 
        intensity="0.4"
      ></a-light>
      <a-light 
        type="directional" 
        position="5 10 5" 
        intensity="0.6"
        shadow="cast: true; shadowMapWidth: 2048; shadowMapHeight: 2048"
        target="#floor"
      ></a-light>
      <a-light 
        type="point" 
        position="0 3 0" 
        intensity="0.3"
        color="#FFE4B5"
      ></a-light>

      {/* Environment */}
      <TherapyEnvironment />

      {/* Exercise Instructor with Ready Player Me Avatar */}
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

      {/* Motivational Text */}
      <a-text 
        position="0 4 -3" 
        value="VR Physical Therapy Session" 
        align="center" 
        color="#2C3E50"
        scale="4 4 4"
        font="kelsonsans"
        animation="property: rotation; to: 0 360 0; dur: 20000; loop: true; easing: linear"
      ></a-text>

      {/* Floating Progress Indicator */}
      {isActive && (
        <a-ring 
          position="0 0.5 2" 
          radius-inner="0.8" 
          radius-outer="1" 
          color="#4CAF50"
          opacity="0.7"
          animation="property: rotation; to: 0 0 360; dur: 3000; loop: true; easing: linear"
        ></a-ring>
      )}

      {/* Camera and Controls */}
      <a-entity id="cameraRig" position="0 1.6 3">
        <a-camera 
          look-controls="enabled: true; pointerLockEnabled: false"
          wasd-controls="enabled: true; acceleration: 50"
          cursor="rayOrigin: mouse; fuse: false"
          animation__shake={isActive ? "property: position; to: 0 1.6 3; dur: 100; loop: false" : ""}
        >
          {/* Camera HUD */}
          <a-text 
            position="0 0.3 -1" 
            value={isActive ? "🔴 Recording Session" : "⚪ Ready"} 
            align="center" 
            color={isActive ? "#E74C3C" : "#95A5A6"}
            scale="0.5 0.5 0.5"
          ></a-text>
        </a-camera>
        
        {/* VR Hand Controllers */}
        <a-entity 
          id="leftHand"
          hand-controls="hand: left; handModelStyle: lowPoly; color: #15803D"
          laser-controls="maxDistance: 10; lineColor: #15803D; lineOpacity: 0.5"
          raycaster="objects: .clickable; lineColor: #15803D; lineOpacity: 0.5"
        ></a-entity>
        <a-entity 
          id="rightHand"
          hand-controls="hand: right; handModelStyle: lowPoly; color: #DC2626"
          laser-controls="maxDistance: 10; lineColor: #DC2626; lineOpacity: 0.5"
          raycaster="objects: .clickable; lineColor: #DC2626; lineOpacity: 0.5"
        ></a-entity>
      </a-entity>

      {/* Enhanced Floor with Pattern */}
      <a-plane 
        id="floor"
        position="0 0 0" 
        rotation="-90 0 0" 
        width="20" 
        height="20" 
        color="#E8F5E8"
        shadow="receive: true"
        material="roughness: 0.8; metalness: 0.1"
      ></a-plane>

      {/* Grid Pattern on Floor */}
      <a-entity>
        {[...Array(10)].map((_, i) => (
          <a-plane 
            key={`grid-x-${i}`}
            position={`${(i-5)*2} 0.01 0`} 
            rotation="-90 0 0" 
            width="0.05" 
            height="20" 
            color="#C8E6C9"
            opacity="0.3"
          ></a-plane>
        ))}
        {[...Array(10)].map((_, i) => (
          <a-plane 
            key={`grid-z-${i}`}
            position={`0 0.01 ${(i-5)*2}`} 
            rotation="-90 0 90" 
            width="0.05" 
            height="20" 
            color="#C8E6C9"
            opacity="0.3"
          ></a-plane>
        ))}
      </a-entity>

      {/* Particle Effects for Motivation */}
      {isActive && (
        <a-entity
          position="0 3 0"
          particle-system="preset: snow; particleCount: 100; color: #4CAF50, #2196F3; size: 0.5"
        ></a-entity>
      )}

      {/* Loading indicator for avatar */}
      <a-text 
        position="2 0.5 -2" 
        value="Loading instructor..." 
        align="center" 
        color="#666"
        scale="1 1 1"
        visible="true"
        animation="property: visible; to: false; delay: 3000"
      ></a-text>
    </a-scene>
  );
};

export default VRScene;