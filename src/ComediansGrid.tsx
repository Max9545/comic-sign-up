import React, { useState } from 'react';
import Popup from './Popup'; // Importing the Popup component

// Define the type for PopupProps
type PopupProps = {
  position: { x: number; y: number };
  onClose: () => void;
  onSelection: (position: string) => void;
  selectedCell: { comedian: any; show: any } | null;
};

const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
  // State to manage the popup visibility, position, and selected cell
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedCell, setSelectedCell] = useState<{ comedian: any; show: any } | null>(null);
  const [comediansNow, setComediansNow] = useState();

  // Group comedians by type
  const groupedComedians: { [type: string]: any[] } = {
    Pro: [],
    OutOfTown: [],
    AlmostFamous: [],
    Inactive: []
  };

  comedians.forEach((comedian) => {
    if (comedian.comedianInfo.type === 'pro') {
      groupedComedians.Pro.push(comedian);
    } else if (comedian.comedianInfo.type === 'OutOfTown') {
      groupedComedians.OutOfTown.push(comedian);
    } else if (comedian.comedianInfo.type === 'AlmostFamous') {
      groupedComedians.AlmostFamous.push(comedian);
    } else if (comedian.comedianInfo.type === 'Inactive') {
      groupedComedians.Inactive.push(comedian);
    }
  });

  // Function to handle cell click
  const handleCellClick = (event: React.MouseEvent<HTMLDivElement>, comedian: any, show: any) => {
    // If the same cell is clicked again, close the popup
    if (selectedCell && selectedCell.comedian.comedianInfo.id === comedian.comedianInfo.id && selectedCell.show.id === show.id) {
      setShowPopup(false);
      setSelectedCell(null);
    } else {
      setPopupPosition({ x: event.clientX, y: event.clientY });
      setSelectedCell({ comedian, show });
      setShowPopup(true);
    }
  };

  // Function to handle popup selection
  const handlePopupSelection = (position: string) => {
    if (selectedCell) {
      const updatedComedians = comedians.map(comedian => {
        if (comedian.comedianInfo.id === selectedCell.comedian.comedianInfo.id) {
          const updatedShowsAvailableDowntown = { ...comedian.comedianInfo.showsAvailabledowntown };
          const updatedShowsAvailableSouth = { ...comedian.comedianInfo.showsAvailablesouth };
          if (selectedCell.comedian.comedianInfo.showsAvailabledowntown[selectedCell.show.day.toLowerCase()].includes(selectedCell.show.id)) {
            updatedShowsAvailableDowntown[selectedCell.show.day.toLowerCase()][selectedCell.show.id] = position;
          } else if (selectedCell.comedian.comedianInfo.showsAvailablesouth[selectedCell.show.day.toLowerCase()].includes(selectedCell.show.id)) {
            updatedShowsAvailableSouth[selectedCell.show.day.toLowerCase()][selectedCell.show.id] = position;
          }
          return {
            ...comedian,
            comedianInfo: {
              ...comedian.comedianInfo,
              showsAvailabledowntown: updatedShowsAvailableDowntown,
              showsAvailablesouth: updatedShowsAvailableSouth
            }
          };
        }
        return comedian;
      });

      // Update the comedians state with the updated data
      setComediansNow(updatedComedians);
      setShowPopup(false);
      setSelectedCell(null);
    }
  };

  // Render comedians under respective headers
  return (
    <div className="grid-container">
      {/* Header row */}
      <div className="row header">
        <div className="cell"></div> {/* Empty cell for spacing */}
        <div className="cell">Downtown</div>
        <div className="cell">South</div>
      </div>

      {/* Iterate through shows to display show information for each Comic Type */}
      {Object.entries(groupedComedians).map(([type, comediansOfType]) => (
        <React.Fragment key={type}>
          {/* Header for Comic Type */}
          <div className="row type-header">
            <div className="cell">{type.replace(/([A-Z])/g, ' $1').trim()}</div>
            {/* Show information for Downtown */}
            {shows.map((show) => (
              <React.Fragment key={`${type}-${show.id}-downtown`}>
                {show.club === 'downtown' && (
                  <div className="cell">{`${show.day} ${show.time} ${show.headliner} ${show.club}`}</div>
                )}
              </React.Fragment>
            ))}
            {/* Show information for South */}
            {shows.map((show) => (
              <React.Fragment key={`${type}-${show.id}-south`}>
                {show.club === 'south' && (
                  <div className="cell">{`${show.day} ${show.time} ${show.headliner} ${show.club}`}</div>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Comedians of this type */}
          {comediansOfType.map((comedian, index) => (
            <div className={`row ${index % 2 === 0 ? 'even' : 'odd'}`} key={comedian.comedianInfo.id}>
              <div className="cell">{comedian.comedianInfo.name}</div>
              {/* Iterate through shows to determine if comedian is available */}
              {shows.map((show) => (
                <div
                  className="cell"
                  key={`${comedian.comedianInfo.id}-${show.id}`}
                  onClick={(event) => handleCellClick(event, comedian, show)}
                >
                  {selectedCell && selectedCell.comedian.comedianInfo.id === comedian.comedianInfo.id && selectedCell.show.id === show.id ?
                    'Select Position' :
                    ((comedian.comedianInfo.showsAvailabledowntown && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id)) ||
                      (comedian.comedianInfo.showsAvailablesouth && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id))) ?
                    'X' : ''}
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}

      {/* Render Popup */}
      {showPopup && (
        <Popup
          position={popupPosition}
          onClose={() => setShowPopup(false)}
          onSelection={handlePopupSelection}
          selectedCell={selectedCell}
        />
      )}
    </div>
  );
};

export default ComediansGrid;
