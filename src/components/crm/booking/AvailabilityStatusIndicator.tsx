
import React from 'react';

interface AvailabilityStatusIndicatorProps {
  isAvailable: boolean;
}

const AvailabilityStatusIndicator = ({ isAvailable }: AvailabilityStatusIndicatorProps) => {
  return (
    <div 
      className={`h-1 w-full rounded-full ${
        isAvailable ? 'bg-green-400' : 'bg-red-400'
      }`}
      title={isAvailable ? 'Available' : 'Unavailable'}
    />
  );
};

export default AvailabilityStatusIndicator;
