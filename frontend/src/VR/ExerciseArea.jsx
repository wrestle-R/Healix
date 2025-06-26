import React from 'react';

const ExerciseArea = ({ exercise, isActive, onRepComplete }) => {
  return (
    <a-entity>
      {/* CLEAN - NO CIRCLES, NO BULLSHIT */}
      {isActive && (
        <a-text 
          position="0 0.5 2" 
          value="Exercise Area" 
          align="center" 
          color="#10B981"
          scale="1.5 1.5 1.5"
        ></a-text>
      )}
    </a-entity>
  );
};

export default ExerciseArea;