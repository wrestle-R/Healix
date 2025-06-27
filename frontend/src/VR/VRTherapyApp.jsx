import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'aframe';
import VRScene from './VRScene';
import ExerciseUI from './ExerciseUI';

const API_URL = import.meta.env.VITE_API_URL;

const VRTherapyApp = () => {
  const { therapyId } = useParams();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [therapy, setTherapy] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch therapy data
  useEffect(() => {
    if (therapyId) {
      fetchTherapy();
    }
  }, [therapyId]);

  const fetchTherapy = async () => {
    try {
      const response = await fetch(`${API_URL}/api/therapies/${therapyId}`);
      const data = await response.json();
      if (data.success) {
        setTherapy(data.therapy);
      }
    } catch (error) {
      console.error('Error fetching therapy:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = therapy?.exercises[currentExerciseIndex];

  // FIXED TIMING - Each rep takes EXACTLY what we say
  const getRepDuration = (exerciseId) => {
    switch (exerciseId) {
      case 'stand': return 3000; // 3 seconds per hold
      case 'arm-raise': return 4000; // 4 seconds per rep
      case 'squat': return 5000; // 5 seconds per rep  
      case 'balance': return 4000; // 4 seconds per balance
      default: return 4000;
    }
  };

  // TIME TRACKING - Real seconds
  useEffect(() => {
    let timeInterval;
    if (isExerciseActive) {
      timeInterval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000); // EXACTLY 1 second
    }
    return () => clearInterval(timeInterval);
  }, [isExerciseActive]);

  // REP COUNTING - Matches model animation
  useEffect(() => {
    let repInterval;
    if (isExerciseActive && currentExercise && repsCompleted < currentExercise.repsTarget) {
      const repDuration = getRepDuration(currentExercise.exerciseId);
      
      repInterval = setInterval(() => {
        setRepsCompleted(prev => {
          const newReps = prev + 1;
          console.log(`✅ Rep ${newReps}/${currentExercise.repsTarget} - ${currentExercise.exerciseName}`);
          
          // Play success sound
          try {
            const audio = document.querySelector('#success-sound');
            if (audio) audio.play();
          } catch (e) { console.log('Sound not available'); }
          
          return newReps;
        });
      }, repDuration);
    }
    return () => clearInterval(repInterval);
  }, [isExerciseActive, currentExercise, repsCompleted]);

  // AUTO-ADVANCE when exercise complete
  useEffect(() => {
    if (currentExercise && repsCompleted >= currentExercise.repsTarget) {
      console.log(`🎉 Exercise "${currentExercise.exerciseName}" COMPLETED!`);
      
      // Stop current exercise
      setIsExerciseActive(false);
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (currentExerciseIndex < therapy.exercises.length - 1) {
          nextExercise();
        } else {
          completeRoutine();
        }
      }, 2000);
    }
  }, [repsCompleted, currentExercise, currentExerciseIndex, therapy]);

  const startExercise = () => {
    console.log('🚀 STARTING:', currentExercise.exerciseName);
    setIsExerciseActive(true);
    setRepsCompleted(0);
    setTimeElapsed(0);
  };

  const nextExercise = () => {
    console.log('⏭️ NEXT EXERCISE');
    setCurrentExerciseIndex(prev => prev + 1);
    setRepsCompleted(0);
    setTimeElapsed(0);
    setIsExerciseActive(false);
  };

  const completeRoutine = () => {
    console.log('🏆 ROUTINE COMPLETED!');
    setIsExerciseActive(false);
    alert('🎉 Congratulations! You completed the entire therapy routine!');
  };

  const exitVR = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-2xl">Loading VR Therapy...</div>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-2xl">Therapy routine not found</div>
      </div>
    );
  }

  return (
    <div className="vr-therapy-app">
      <VRScene 
        exercise={currentExercise}
        isActive={isExerciseActive}
        therapy={therapy}
        currentExerciseIndex={currentExerciseIndex}
        repsCompleted={repsCompleted}
        timeElapsed={timeElapsed}
      />
      <ExerciseUI 
        exercise={currentExercise}
        repsCompleted={repsCompleted}
        totalReps={currentExercise?.repsTarget || 10}
        timeElapsed={timeElapsed}
        estimatedTime={currentExercise?.duration * 60}
        isActive={isExerciseActive}
        onStart={startExercise}
        onNext={nextExercise}
        onExit={exitVR}
        therapy={therapy}
        exerciseIndex={currentExerciseIndex}
      />
    </div>
  );
};

export default VRTherapyApp;