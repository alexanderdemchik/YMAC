import React from 'react';
import TrackSrc from '../../assets/emptytrack.png';

export const TrackPlaceholder = () => {
  
  return (
    <div style={{background: `url(${TrackSrc})`, backgroundSize: 'contain', backgroundPosition: 'center', height: '100%', width: '100%'}}>

    </div>
  );
}