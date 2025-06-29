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
      background="color: #f1f5f9"
      shadow="type: pcf; shadowMapWidth: 2048; shadowMapHeight: 2048"
      renderer="antialias: true; colorManagement: true"
    >
      {/* 🎨 ASSETS */}
      <a-assets>
        {/* Exercise Models */}
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

        {/* 🏠 ROOM MODELS */}
        <a-asset-item id="modern-chair" src="/models/room/modern-chair.glb"></a-asset-item>
        <a-asset-item id="yoga-mat" src="/models/room/yoga-mat.glb"></a-asset-item>
        <a-asset-item id="water-bottle" src="/models/room/water-bottle.glb"></a-asset-item>
        <a-asset-item id="towel-rack" src="/models/room/towel-rack.glb"></a-asset-item>
        <a-asset-item id="potted-plant" src="/models/room/potted-plant.glb"></a-asset-item>
        <a-asset-item id="floor-lamp" src="/models/room/floor-lamp.glb"></a-asset-item>
        <a-asset-item id="motivational-poster" src="/models/room/motivational-poster.glb"></a-asset-item>
        <a-asset-item id="small-table" src="/models/room/small-table.glb"></a-asset-item>
        <a-asset-item id="mirror-wall" src="/models/room/mirror-wall.glb"></a-asset-item>
        <a-asset-item id="mirror" src="/models/room/mirror.glb"></a-asset-item>
        <a-asset-item id="therapy-ball" src="/models/room/therapy-ball.glb"></a-asset-item>
        <a-asset-item id="window" src="/models/room/window.glb"></a-asset-item>
        <a-asset-item id="ceiling-light" src="/models/room/ceiling-light.glb"></a-asset-item>
      </a-assets>

      {/* 🌟 PROPER LIGHTING */}
      <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
      <a-light type="directional" position="5 8 5" intensity="1.0" shadow="cast: true" color="#ffffff"></a-light>
      <a-light type="point" position="0 3 0" intensity="0.5" color="#4A90E2" distance="10"></a-light>
{/* 🏠 ROOM STRUCTURE - COMPLETE 4 WALLS */}

{/* Floor - YOUR WOOD TEXTURE */}
<a-plane 
  position="0 0 0" 
  rotation="-90 0 0" 
  width="12" 
  height="12" 
  material="src: /wood-floor.jpg; repeat: 4 4; roughness: 0.8; metalness: 0.1"
  shadow="receive: true"
></a-plane>

{/* 🧱 LEFT WALL - TALLER */}
<a-box 
  position="-6 3 0" 
  width="0.2" 
  height="8" 
  depth="12" 
  material="src: /wall-texture.jpg; repeat: 1 3" 
  shadow="receive: true"
></a-box>

{/* 🧱 RIGHT WALL - TALLER with WINDOW CUTOUT */}
<a-box 
  position="6 3 0" 
  width="0.2" 
  height="8" 
  depth="12" 
  material="src: /wall-texture.jpg; repeat: 1 3" 
  shadow="receive: true"
></a-box>

{/* 🪟 WINDOW - ON RIGHT WALL */}
<a-gltf-model 
  src="#window" 
  position="8 1 -1" 
  scale="0.05 0.05 0.05" 
  rotation="0 0 0"
  shadow="cast: true; receive: true"
></a-gltf-model>
{/* 🌌 SIMPLE OUTSIDE DARKNESS */}
<a-box 
  position="5.8 3.3 1.5" 
  width="0.1" 
  height="3.5" 
  depth="2" 
  material="color: #000000; opacity: 0.95; transparent: true"
  shadow="receive: false"
></a-box>

{/* 🧱 BACK WALL - TALLER */}
<a-box 
  position="0 3 -6" 
  width="12" 
  height="8" 
  depth="0.2" 
  material="src: /wall-texture.jpg; repeat: 6 3" 
  shadow="receive: true"
></a-box>

{/* 🧱 FRONT WALL - TALLER */}
<a-box 
  position="0 3 6" 
  width="12" 
  height="8" 
  depth="0.2" 
  material="src: /wall-texture.jpg; repeat: 6 3" 
  shadow="receive: true"
></a-box>

{/* 🏠 CEILING - HIGHER UP */}
<a-plane 
  position="0 7 0" 
  rotation="90 0 0" 
  width="12" 
  height="12" 
  material="src: /ceiling.jpg; repeat: 4 4; color: #f8fafc" 
  shadow="receive: true"
></a-plane>

      {/* 🪞 MIRROR with YOUR TEXTURE */}
      <a-plane 
        position="-5.8 2.5 0" 
        width="2.5" 
        height="3.5" 
        rotation="0 90 0"
        material="src: /mirror.jpg; metalness: 0.9; roughness: 0.1"
        shadow="receive: false"
      ></a-plane>

      {/* 🖼️ MOTIVATIONAL POSTER - Left wall, BIGGER */}
      <a-gltf-model 
        src="#motivational-poster" 
        position="-2 2 -5.8" 
        scale="3.0 5.0 0.1"
        shadow="receive: true"
      ></a-gltf-model>

      {/* 🤖 EXERCISE INSTRUCTOR - PROPER SIZE & POSITION */}
      <ExerciseInstructor 
        exercise={exercise} 
        isActive={isActive} 
        repsCompleted={repsCompleted}
      />

      {/* 🏠 ROOM DECORATIONS - FIXED SIZES & POSITIONS */}
      
      {/* 🧘 YOGA MAT - RIGHT UNDER INSTRUCTOR */}
      <a-gltf-model 
        src="#yoga-mat" 
        position="0 0.01 -1" 
        scale="1.0 1.0 1.0" 
        rotation="0 0 0"
        shadow="receive: true"
      ></a-gltf-model>

      {/* 🏓 WATER STATION - Right back corner, MUCH SMALLER table */}
      <a-gltf-model 
        src="#small-table" 
        position="4 0 -4" 
        scale="0.09 0.09 0.09"
        shadow="cast: true; receive: true"
      ></a-gltf-model>

      <a-gltf-model 
        src="#water-bottle" 
        position="4 1.5 -4" 
        scale="0.2 0.2 0.2"
        shadow="cast: true"
      ></a-gltf-model>

{/* ⚽ THERAPY BALL - PROPER SIZE */}
<a-gltf-model 
  src="#therapy-ball" 
  position="-1 0 -3" 
  scale="0.02 0.02 0.02"
  shadow="cast: true; receive: true"
></a-gltf-model>

      {/* 🌿 PLANT - Back left corner, MUCH SMALLER */}
      <a-gltf-model 
        src="#potted-plant" 
        position="-4 0 4" 
        scale="0.15 0.2 0.15"
        shadow="cast: true; receive: true"
      ></a-gltf-model>

      {/* 🌿 PLANT - Back right corner, MUCH SMALLER */}
      <a-gltf-model 
        src="#potted-plant" 
        position="4 0 4" 
        scale="0.15 0.2 0.15"
        shadow="cast: true; receive: true"
      ></a-gltf-model>

      {/* 🪑 THERAPY CHAIR - BIGGER, FACING OPPOSITE (towards center) */}
      <a-gltf-model 
        src="#modern-chair" 
        position="-4 0 -4" 
        scale="1.5 1.5 1.5" 
        rotation="0 135 0"
        shadow="cast: true; receive: true"
      ></a-gltf-model>

      {/* 🏺 TOWEL RACK - ROTATED 45 degrees to wall */}
      <a-gltf-model 
        src="#towel-rack" 
        position="5.5 0 -2" 
        scale="0.4 0.6 0.4"
        rotation="0 -45 0"
        shadow="cast: true; receive: true"
      ></a-gltf-model>

      {/* 💡 FLOOR LAMP - Left corner */}
      <a-gltf-model 
        src="#floor-lamp" 
        position="-5 0 2" 
        scale="1.0 1.5 1.0"
        shadow="cast: true; receive: true"
      ></a-gltf-model>

      {/* 📱 CAMERA - Better positioning */}
      <a-entity id="cameraRig" position="0 1.6 4">
        <a-camera 
          look-controls="enabled: true" 
          wasd-controls="enabled: true; acceleration: 60" 
          cursor="rayOrigin: mouse"
          fov="75"
        ></a-camera>
      </a-entity>
    </a-scene>
  );
};

export default VRScene;