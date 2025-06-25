import React, { useEffect, useRef } from 'react';

const ExerciseInstructor = ({ exercise, currentStep, isActive }) => {
  const instructorRef = useRef();

  useEffect(() => {
    if (isActive && instructorRef.current) {
      // Start animation based on exercise type
      demonstrateExercise();
    }
  }, [isActive, currentStep]);

  const demonstrateExercise = () => {
    const instructor = instructorRef.current;
    if (!instructor) return;

    switch (exercise.id) {
      case 'arm-raise':
        // Animate arm raising
        instructor.setAttribute('animation', {
          property: 'rotation',
          to: '0 0 45',
          dur: 2000,
          dir: 'alternate',
          loop: true
        });
        break;
      case 'squat':
        // Animate squatting motion
        instructor.setAttribute('animation', {
          property: 'position',
          to: '2 0.5 -2',
          dur: 3000,
          dir: 'alternate',
          loop: true
        });
        break;
      default:
        break;
    }
  };

  return (
    <a-entity ref={instructorRef} position="2 1 -2">
      {/* Simple instructor representation */}
      <a-cylinder 
        position="0 1 0" 
        radius="0.3" 
        height="2" 
        color="#FFD93D"
      ></a-cylinder>
      <a-sphere 
        position="0 2.2 0" 
        radius="0.2" 
        color="#FFAB91"
      ></a-sphere>
      
      {/* Arms */}
      <a-cylinder 
        position="-0.4 1.5 0" 
        radius="0.05" 
        height="1" 
        color="#FFAB91"
        rotation="0 0 -30"
      ></a-cylinder>
      <a-cylinder 
        position="0.4 1.5 0" 
        radius="0.05" 
        height="1" 
        color="#FFAB91"
        rotation="0 0 30"
      ></a-cylinder>

      {/* Text label */}
      <a-text 
        position="0 2.8 0" 
        value="Follow Me!" 
        align="center" 
        color="#333"
        scale="2 2 2"
      ></a-text>
    </a-entity>
  );
};

export default ExerciseInstructor;