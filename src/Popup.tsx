import React, { useState } from 'react';

interface PopupProps {
  position: { x: number; y: number };
  onClose: (position: string) => void; // Pass the selected position to onClose function
}

const Popup: React.FC<PopupProps> = ({ position, onClose }) => {
  const [selectedPosition, setSelectedPosition] = useState<string>(''); // Initialize selectedPosition state with an empty string
  const [otherPosition, setOtherPosition] = useState<string>('')

  // Function to handle position selection
  const handlePositionSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(event.target.value);
  };

  return (
    
    <div className="popup" style={{ position: 'fixed', top: position.y, left: position.x }}
    onKeyUp={(e) => {
      if (e.key === "Enter") {
        onClose(otherPosition || selectedPosition || 'MC')    
      }
    }}
    >
    <div className="close-icon" onClick={() => onClose('')}>
    <span>X</span>
  </div>
    <br></br>
      <div className="popup-content">
        <div>
          <label htmlFor="position">Position:</label>
          <select id="position" onChange={handlePositionSelection}>
            <option value="MC">MC</option>
            <option value="A1">A1</option>
            <option value="B1">B1</option>
            <option value="*7">*7</option>
            <option value="*MC">*MC</option>
            <option value={null}>X</option>
          </select>
        </div>
        <div>
          <label htmlFor="other">Other:</label>
          <input type="text" id="other" onChange={(e) => setOtherPosition(e.target.value)}/>
        </div>
        <button onClick={() => onClose(otherPosition || selectedPosition || 'MC')}>Submit</button> {/* Pass the selected position to onClose function */}
      </div>
    </div>
  );
};

export default Popup;
