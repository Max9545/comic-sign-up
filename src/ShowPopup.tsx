import React, { useState } from 'react';

const ShowPopup: React.FC<{ position: any, show: any; onClose: () => void; onSave: (editedShow: any) => void }> = ({ position, show, onClose, onSave }) => {
  const [editedShow, setEditedShow] = useState<any>({ ...show });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedShow({ ...editedShow, [name]: value });
  };

  const handleSave = () => {
    onSave(editedShow);
  };

  return (
    <div className="show-popup" style={{ position: 'fixed', top: position.y, left: position.x }}>
      <div>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Show Details</h2>

      </div>
      <div className="popup-content show-popup-content">
        <form>
          <label>
            Date:
            <input type="text" name="date" value={editedShow.date} onChange={handleInputChange} />
          </label>
          <br></br>
          <label>
            Day:
            <input type="text" name="day" value={editedShow.day} onChange={handleInputChange} />
          </label>
          <br></br>
          <label>
            Time:
            <input type="text" name="time" value={editedShow.time} onChange={handleInputChange} />
          </label>
          <br></br>
          <label>
            Comic:
            <input type="text" name="headliner" value={editedShow.headliner} onChange={handleInputChange} />
          </label>
          <br></br>
          <label>
            Club:
            <input type="text" name="club" value={editedShow.club} onChange={handleInputChange} />
          </label>
          {/* Add more input fields for other show details as needed */}
          <button type="button" onClick={handleSave}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default ShowPopup;
