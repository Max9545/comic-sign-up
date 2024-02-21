import React, { useState } from 'react';

interface PopupProps {
  position: { x: number; y: number };
  onClose: (position: string) => void; // Pass the selected position to onClose function
}

const Popup: React.FC<PopupProps> = ({ position, onClose }) => {
  const [otherPosition, setOtherPosition] = useState<string>('')

  // Function to handle position selection
  const handlePositionSelection = (position: string) => {
    onClose(position);
  };

  return (
    <div className="popup" style={{ position: 'fixed', top: position.y, left: position.x }}
    onKeyUp={(e) => {
      if (e.key === "Enter") {
        onClose(otherPosition);    
      }
    }}
    >
    <div className="close-icon" onClick={() => onClose('')}>
      <span>X</span>
    </div>
    <br />
    <div className="popup-content">
      <div>
        <label>Position:</label>
        <div>
          <button onClick={() => handlePositionSelection('MC')}>MC</button>
          <button onClick={() => handlePositionSelection('A1')}>A1</button>
          <button onClick={() => handlePositionSelection('B1')}>B1</button>
          <button onClick={() => handlePositionSelection('*7')}>*7</button>
          <button onClick={() => handlePositionSelection('*MC')}>*MC</button>
          <button onClick={() => handlePositionSelection('X')}>X</button>
          <button onClick={() => handlePositionSelection('remove')}>Remove</button>
        </div>
      </div>
      <div>
        <label htmlFor="other">Other:</label>
        <input type="text" id="other" onChange={(e) => setOtherPosition(e.target.value)}/>
      </div>
    </div>
  </div>
  );
};

export default Popup;
