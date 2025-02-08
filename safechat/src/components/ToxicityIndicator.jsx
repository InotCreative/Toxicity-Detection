import React from 'react';

const ToxicityIndicator = ({ toxicityScore }) => {
  // Determine color based on toxicity score
  const getColorForScore = (score) => {
    if (score < 0.3) return '#10b981'; // green
    if (score < 0.7) return '#f59e0b'; // yellow/orange
    return '#ef4444'; // red
  };

  return (
    <div className="toxicity-indicator">
      <div 
        className="toxicity-level" 
        style={{ 
          width: `${toxicityScore * 100}%`,
          backgroundColor: getColorForScore(toxicityScore)
        }}
      />
    </div>
  );
};

export default ToxicityIndicator;