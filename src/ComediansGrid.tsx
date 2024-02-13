  import React, { useState } from 'react';
  import Popup from './Popup'; // Importing the Popup component

  // Define the type for PopupProps
  type PopupProps = {
    position: { x: number; y: number };
    onClose: () => void;
    onSelection: (position: string) => void;
  };

  const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
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

    // State to manage the popup visibility, position, and selected cells
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [selectedCells, setSelectedCells] = useState<{ [key: string]: { comedian: any; show: any; selectedPosition: string | null } }>({});
    const [comediansNow, setComediansNow] = useState(comedians);

   // Function to handle cell click
const handleCellClick = (event: React.MouseEvent<HTMLDivElement>, comedian: any, show: any) => {
  const cellKey = `${comedian.comedianInfo.id}-${show.id}`;
  const cellData = selectedCells[cellKey];

  if (cellData && cellData.comedian.comedianInfo.id === comedian.comedianInfo.id && cellData.show.id === show.id) {
    setShowPopup(false);
  } else {
    setPopupPosition({ x: event.clientX, y: event.clientY });
    setSelectedCells({
      ...selectedCells,
      [cellKey]: { comedian, show, selectedPosition: cellData ? cellData.selectedPosition : null }
    });
    setShowPopup(true);
  }
};

// Function to handle popup selection
const handlePopupSelection = (position: string, cellKey: string) => {
  if (selectedCells[cellKey]) {
    const { comedian, show } = selectedCells[cellKey];
    const updatedCells = { ...selectedCells };

    const updatedShowsAvailableDowntown = { ...comedian.comedianInfo.showsAvailabledowntown };
    const updatedShowsAvailableSouth = { ...comedian.comedianInfo.showsAvailablesouth };

    if (show.club === 'downtown' && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()]?.includes(show.id)) {
      updatedShowsAvailableDowntown[show.day.toLowerCase()][show.id] = position;
    } else if (show.club === 'south' && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()]?.includes(show.id)) {
      updatedShowsAvailableSouth[show.day.toLowerCase()][show.id] = position;
    }

    updatedCells[cellKey] = {
      ...selectedCells[cellKey],
      selectedPosition: position
    };

    setSelectedCells(updatedCells);
    setShowPopup(false);
  }
};


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
        {Object.entries(groupedComedians).map(([type, comediansOfType]: [string, any[]], typeIndex) => (
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
            {comediansOfType.map((comedian: any, index: number) => (
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
                      {selectedCells[`${comedian.comedianInfo.id}-${show.id}`] ?
                        selectedCells[`${comedian.comedianInfo.id}-${show.id}`].selectedPosition || 'Select Position'
                        : (
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
                      {selectedCells[`${comedian.comedianInfo.id}-${show.id}`] ?
                        selectedCells[`${comedian.comedianInfo.id}-${show.id}`].selectedPosition || 'Select Position'
                        : (
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
    onClose={(position) => handlePopupSelection(position, Object.keys(selectedCells)[Object.keys(selectedCells).length - 1])} // Pass the selected position and cellKey
  />
)}
      </div>
    );
  };

  export default ComediansGrid;
