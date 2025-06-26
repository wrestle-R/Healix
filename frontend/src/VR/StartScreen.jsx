import React from 'react';

const StartScreen = ({ onStartVR }) => {
  const exercises = [
    { id: 'arm-raise', name: 'Arm Raise Therapy', duration: '5 min', difficulty: 'Easy' },
    { id: 'squat', name: 'Squat Exercise', duration: '8 min', difficulty: 'Medium' },
    { id: 'balance', name: 'Balance Training', duration: '10 min', difficulty: 'Easy' }
  ];

  return (
    <div className="start-screen">
      <div className="container">
        <h1>VR Physical Therapy</h1>
        <p>Choose your rehabilitation exercise</p>
        
        <div className="exercise-grid">
          {exercises.map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <h3>{exercise.name}</h3>
              <p>Duration: {exercise.duration}</p>
              <p>Difficulty: {exercise.difficulty}</p>
              <button 
                onClick={() => onStartVR(exercise)}
                className="start-btn"
              >
                Start VR Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;