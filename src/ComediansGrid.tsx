import React, { useState } from 'react';
import Popup from './Popup'; // Importing the Popup component

// Define the type for PopupProps
type PopupProps = {
  position: { x: number; y: number };
  onClose: () => void;
  onSelection: (position: string) => void;
  selectedCell: { comedian: any; show: any; selectedPosition: string | null } | null;
};

const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
  // State to manage the popup visibility, position, and selected cell
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedCell, setSelectedCell] = useState<{ comedian: any; show: any; selectedPosition: string | null } | null>(null);
  const [comediansNow, setComediansNow] = useState(comedians);

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
    console.log(selectedCell)
    if (selectedCell && selectedCell.comedian.comedianInfo.id === comedian.comedianInfo.id && selectedCell.show.id === show.id) {
      setShowPopup(false);
      // Do not clear the selected cell when clicking on the same cell
    } else {
      setPopupPosition({ x: event.clientX, y: event.clientY });
      setSelectedCell({ comedian, show, selectedPosition: selectedCell ? selectedCell.selectedPosition : null });
      setShowPopup(true);
    }
  };

  // Function to handle popup selection
  const handlePopupSelection = (position: string) => {
    if (selectedCell) {
      const updatedComedians = comediansNow.map(comedian => {
        if (comedian.comedianInfo.id === selectedCell.comedian.comedianInfo.id) {
          const updatedShowsAvailableDowntown = { ...comedian.comedianInfo.showsAvailabledowntown };
          const updatedShowsAvailableSouth = { ...comedian.comedianInfo.showsAvailablesouth };
          if (selectedCell.show.club === 'downtown' && selectedCell.comedian.comedianInfo.showsAvailabledowntown[selectedCell.show.day.toLowerCase()]?.includes(selectedCell.show.id)) {
            updatedShowsAvailableDowntown[selectedCell.show.day.toLowerCase()][selectedCell.show.id] = position;
          } else if (selectedCell.show.club === 'south' && selectedCell.comedian.comedianInfo.showsAvailablesouth[selectedCell.show.day.toLowerCase()]?.includes(selectedCell.show.id)) {
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

      // Update selected position for the cell
      setSelectedCell({ ...selectedCell, selectedPosition: position });

      // Update only the selected cell in the comedians state
      setComediansNow(updatedComedians);
      setShowPopup(false);
    }
  };

// Render comedians under respective headers
// Render comedians under respective headers
return (
  <div className="grid-container">
    {/* Header row */}
    <div className="row header">
      <div className="cell"></div> {/* Empty cell for spacing */}
      {/* Header for Downtown shows */}
      <div className="cell">Downtown</div>
      {/* Header for South Club shows */}
      <div className="cell">South</div>
    </div>

    {/* Iterate through shows to display show information for each Comic Type */}
    {Object.entries(groupedComedians).map(([type, comediansOfType], typeIndex) => (
      <React.Fragment key={type}>
        {/* Header row for Comic Type */}
        <div className="row type-header">
          <div className="cell type-cell">{type.replace(/([A-Z])/g, ' $1').trim()}</div>
          {/* Downtown show information */}
          {shows
            .filter(show => show.club === 'downtown')
            .map(show => (
              <div className="cell" key={`${type}-${show.id}`}>
                {`${show.day.slice(0, 3)} ${show.time.slice(0, -2)} ${show.headliner} ${show.club.slice(0, -4)}`}
              </div>
            ))}
          {/* South Club show information */}
          {shows
            .filter(show => show.club === 'south')
            .map(show => (
              <div className="cell" key={`${type}-${show.id}`}>
                {`${show.day.slice(0, 3)} ${show.time.slice(0, -2)} ${show.headliner} ${show.club}`}
              </div>
            ))}
        </div>
        {/* Comedians of this type */}
        {comediansOfType.map((comedian, index) => (
          <div className={`row ${index % 2 === 0 ? 'even' : 'odd'}`} key={comedian.comedianInfo.id}>
            {/* Comedian name cell */}
            <div className="cell">{comedian.comedianInfo.name}</div>
            {/* Downtown show cells */}
            {shows
              .filter(show => show.club === 'downtown')
              .map(show => (
                <div
                  className="cell"
                  key={`${comedian.comedianInfo.id}-${show.id}`}
                  onClick={(event) => handleCellClick(event, comedian, show)}
                >
                  {selectedCell &&
                    selectedCell.comedian.comedianInfo.id === comedian.comedianInfo.id &&
                    selectedCell.show.id === show.id ? (
                      selectedCell.selectedPosition || 'Select Position'
                    ) : (
                      (comedian.comedianInfo.showsAvailabledowntown &&
                        comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()] &&
                        comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id)) ?
                        'X' : ''
                    )}
                </div>
              ))}
            {/* South Club show cells */}
            {shows
              .filter(show => show.club === 'south')
              .map(show => (
                <div
                  className="cell"
                  key={`${comedian.comedianInfo.id}-${show.id}`}
                  onClick={(event) => handleCellClick(event, comedian, show)}
                >
                  {selectedCell &&
                    selectedCell.comedian.comedianInfo.id === comedian.comedianInfo.id &&
                    selectedCell.show.id === show.id ? (
                      selectedCell.selectedPosition || 'Select Position'
                    ) : (
                      (comedian.comedianInfo.showsAvailablesouth &&
                        comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()] &&
                        comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id)) ?
                        'X' : ''
                    )}
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
        onClose={(position) => handlePopupSelection(position)} // Pass the selected position to handlePopupSelection
      />
    )}
  </div>
);








};

export default ComediansGrid;
