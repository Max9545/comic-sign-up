import React from 'react';

interface PopupProps {
  position: { x: number; y: number };
  onClose: () => void;
  selectedCell: { comedian: any; show: any } | null;
}

const Popup: React.FC<PopupProps> = ({ position, onClose, selectedCell }) => {
  return (
    <div className="popup" style={{ position: 'fixed', top: position.y, left: position.x }}>
      <div className="popup-content">
        <div>
          <label htmlFor="position">Position:</label>
          <select id="position">
            <option value="MC">MC</option>
            <option value="A1">A1</option>
            <option value="B1">B1</option>
            <option value="*7">*7</option>
            <option value="*MC">*MC</option>
          </select>
        </div>
        <div>
          <label htmlFor="other">Other:</label>
          <input type="text" id="other" />
        </div>
        <button onClick={onClose}>Submit</button>
      </div>
    </div>
  );
};

export default Popup;
