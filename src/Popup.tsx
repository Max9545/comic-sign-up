import React, { useState } from 'react';

interface PopupProps {
  position: { x: number; y: number };
  onClose: (position: string) => void; // Pass the selected position to onClose function
  showPopup: boolean; // Define the showPopup prop
  setShowPopup: (value: boolean) => void; // Define the setShowPopup prop
}


const Popup: React.FC<PopupProps> = ({ position, onClose, showPopup, setShowPopup }) => {
  const [otherPosition, setOtherPosition] = useState<string>('');

  // Function to handle position selection
  const handlePositionSelection = (position: string) => {
    onClose(position);
    setShowPopup(!showPopup)
  };

  // Function to handle submission of other position
  const handleSubmit = () => {
    onClose(otherPosition);
    setShowPopup(!showPopup)
  };

  // Function to handle closing the popup without changing any info
  const handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };  

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup" style={{ position: 'fixed', top: position.y, left: position.x }}>
        <div className="close-icon" onClick={() => setShowPopup(!showPopup)}>
          <span>X</span>
        </div>
        <br />
        <div className="popup-content">
          <div>
            <label>Position:</label>
            <div className='popup-button-box'>
              <button onClick={() => handlePositionSelection('MC')} className='popup-button'>MC</button>
              <button onClick={() => handlePositionSelection('A1')} className='popup-button'>A1</button>
              <button onClick={() => handlePositionSelection('B1')} className='popup-button'>B1</button>
              <button onClick={() => handlePositionSelection('*7')} className='popup-button'>*7</button>
              <button onClick={() => handlePositionSelection('*MC')} className='popup-button'>*MC</button>
              <button onClick={() => handlePositionSelection('X')} className='popup-button'>X</button>
              <button onClick={() => handlePositionSelection('remove')} className='popup-button'>Remove</button>
            </div>
          </div>
          <div>
            <label htmlFor="other">Other:</label>
            <input 
            type="text" 
            id="other"
            onChange={(e) => setOtherPosition(e.target.value)} 
            onKeyPress={handleKeyPress} 
            autoFocus/>
          </div>
          <button onClick={handleSubmit} className='popup-submit'>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
