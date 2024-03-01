  import React, { useEffect, useRef, useState } from 'react';

  const ShowPopup: React.FC<{ position: any, show: any; onClose: () => void; onSave: (editedShow: any) => void }> = ({ position, show, onClose, onSave }) => {
    const [editedShow, setEditedShow] = useState<any>({ ...show });
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          onClose(); // Close the popup if clicked outside
        }
      };

      // Attach event listener when the component mounts
      document.addEventListener('mousedown', handleClickOutside);

      // Cleanup the event listener when the component unmounts
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditedShow({ ...editedShow, [name]: value });
    };

    const handleSave = () => {
      onSave(editedShow);
    };

    return (
      <div ref={popupRef} className="show-popup" style={{ position: 'fixed', top: position.y, left: position.x }}>
        <div>
          <span className="close" onClick={onClose}>&times;</span>
          <h2>Edit Show Details</h2>

        </div>
        <div className="popup-content show-popup-content">
          <form className='change-show-form'>
            <label>
              Date:
            </label>
              <input type="text" name="date" value={editedShow.date} onChange={handleInputChange} />
            <br></br>
            <label>
              Day:
            </label>
              <input type="text" name="day" value={editedShow.day} onChange={handleInputChange} />
            <br></br>
            <label>
              Time:
            </label>
              <input type="text" name="time" value={editedShow.time} onChange={handleInputChange} />
            <br></br>
            <label>
              Comic:
            </label>
              <input type="text" name="headliner" value={editedShow.headliner} onChange={handleInputChange} />
            <br></br>
            <label>
              Club:
            </label>
            <div>
            <input
              type="radio"
              id="downtown"
              name="club"
              value="downtown"
              checked={editedShow.club === 'downtown'}
              onChange={handleInputChange}
            />
            <label htmlFor="downtown">Downtown</label>
          </div>
          <div>
            <input
              type="radio"
              id="south"
              name="club"
              value="south"
              checked={editedShow.club === 'south'}
              onChange={handleInputChange}
            />
            <label htmlFor="south">South</label>
          </div>
            {/* Add more input fields for other show details as needed */}
            <button className='edit-show-save' type="button" onClick={handleSave}>Save</button>
          </form>
        </div>
      </div>
    );
  };

  export default ShowPopup;
