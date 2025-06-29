import React, { useEffect } from 'react';
import 'aframe';
import 'aframe-extras';
import 'aframe-environment-component';
import TherapyEnvironment from './TherapyEnvironment';
import ExerciseInstructor from './ExerciseInstructor';
import ExerciseArea from './ExerciseArea';

const VRScene = ({ exercise, isActive, therapy, currentExerciseIndex, repsCompleted, timeElapsed }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AFRAME) {
      console.log('🎮 VR Therapy Room - READY!');
      console.log('🏃 Current Exercise:', exercise?.exerciseName, exercise?.exerciseId);
    }
  }, [exercise]);

  return (
    <a-scene 
      vr-mode-ui="enabled: true" 
      embedded 
      style={{ height: '100vh', width: '100vw' }}
      background="color: #E8F4FD"
      shadow="type: pcf; shadowMapWidth: 2048; shadowMapHeight: 2048"
    >
      {/* Assets - NO SOUND FILES */}
      <a-assets>
        {/* Load ALL your models */}
        <a-asset-item id="arm-stretching-model" src="/models/Arm_Stretching.glb"></a-asset-item>
        <a-asset-item id="arms-up-model" src="/models/Arms_Up.glb"></a-asset-item>
        <a-asset-item id="burpee-model" src="/models/Burpee.glb"></a-asset-item>
        <a-asset-item id="front-raises-model" src="/models/Front_Raises.glb"></a-asset-item>
        <a-asset-item id="jogging-model" src="/models/Jogging.glb"></a-asset-item>
        <a-asset-item id="left-leg-balance-model" src="/models/Left_Leg_Balance.glb"></a-asset-item>
        <a-asset-item id="neck-stretching-model" src="/models/Neck Stretching.glb"></a-asset-item>
        <a-asset-item id="plank-model" src="/models/Plank.glb"></a-asset-item>
        <a-asset-item id="push-up-model" src="/models/Push_Up.glb"></a-asset-item>
        <a-asset-item id="right-leg-balance-model" src="/models/Right_Leg_Balance.glb"></a-asset-item>
        <a-asset-item id="situps-model" src="/models/Situps.glb"></a-asset-item>
        <a-asset-item id="squat-model" src="/models/Squat.glb"></a-asset-item>
        <a-asset-item id="stair-climbing-model" src="/models/Stair_Climbing.glb"></a-asset-item>
        <a-asset-item id="stand-model" src="/models/Stand.glb"></a-asset-item>
        <a-asset-item id="walking-model" src="/models/Walking.glb"></a-asset-item>
        <a-asset-item id="warming-up-model" src="/models/Warming_Up.glb"></a-asset-item>
      </a-assets>

      {/* Lighting optimized for model visibility */}
      <a-light type="ambient" color="#ffffff" intensity="0.7"></a-light>
      <a-light type="directional" position="5 10 5" intensity="0.9" shadow="cast: true"></a-light>

      {/* Environment */}
      <TherapyEnvironment />

      {/* Instructor with FIXED model paths */}
      <ExerciseInstructor 
        exercise={exercise} 
        isActive={isActive} 
        repsCompleted={repsCompleted}
      />

      {/* Exercise area */}
      <ExerciseArea exercise={exercise} isActive={isActive} />

      {/* Camera positioned for best view */}
      <a-entity id="cameraRig" position="0 1.6 3">
        <a-camera 
          look-controls="enabled: true" 
          wasd-controls="enabled: true" 
          cursor="rayOrigin: mouse; fuse: false"
        ></a-camera>
      </a-entity>

      {/* Floor */}
      <a-plane 
        id="floor" 
        position="0 0 0" 
        rotation="-90 0 0" 
        width="20" 
        height="20" 
        color="#F5E6D3"
        shadow="receive: true"
      ></a-plane>

      {/* 🔥 THERAPY INFO - Always visible when active */}
      {isActive && exercise && (
        <a-text 
          position="0 3.5 -2" 
          value={`${therapy?.routineName || 'Therapy Session'}\nExercise ${currentExerciseIndex + 1} of ${therapy?.exercises.length}`}
          align="center" 
          color="#4A90E2"
          scale="1.2 1.2 1.2"
        ></a-text>
      )}

      {/* 🔥 EXERCISE INSTRUCTIONS */}
      {isActive && exercise && exercise.instructions && (
        <a-text 
          position="0 2.8 -2" 
          value={exercise.instructions}
          align="center" 
          color="#FF6B6B"
          scale="1.0 1.0 1.0"
          wrap-count="50"
        ></a-text>
      )}

      {/* 🔥 REP COUNTER in VR */}
      {isActive && (
        <a-text 
          position="0 2.2 -2" 
          value={`Reps: ${repsCompleted}/${exercise?.repsTarget || 10}`}
          align="center" 
          color="#4ECDC4"
          scale="1.4 1.4 1.4"
        ></a-text>
      )}

      {/* 🔥 TIMER in VR */}
      {isActive && (
        <a-text 
          position="0 1.8 -2" 
          value={`Time: ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`}
          align="center" 
          color="#95E1D3"
          scale="1.2 1.2 1.2"
        ></a-text>
      )}

      {/* 🔥 READY MESSAGE when not active */}
      {!isActive && (
        <a-text 
          position="0 2.5 -2" 
          value="Ready to Start!\nClick 'Start Exercise' button"
          align="center" 
          color="#FFD93D"
          scale="1.5 1.5 1.5"
        ></a-text>
      )}
    </a-scene>
  );
};

export default VRScene;