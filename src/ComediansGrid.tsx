  import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from './firebase';
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


const publishShow = async () => {
  if (Object.keys(selectedCells).length > 0) {
    const selectedCellKey = Object.keys(selectedCells)[Object.keys(selectedCells).length - 1];
    const selectedCell = selectedCells[selectedCellKey];

    const comicArray: { showId: string; type: unknown; comic: any }[] = [];

    // Iterate through all the comedians
    comediansNow.forEach((comedian) => {
      // Check if the comedian is available for any shows
      const availableShowsDowntown = comedian.comedianInfo.showsAvailabledowntown[selectedCell.show.day.toLowerCase()] || {};
      const availableShowsSouth = comedian.comedianInfo.showsAvailablesouth[selectedCell.show.day.toLowerCase()] || {};
      const availableShows = { ...availableShowsDowntown, ...availableShowsSouth };

      // Iterate through all available shows for the comedian
      Object.entries(availableShows).forEach(([showId, position]) => {
        const targetShow = shows.find(show => show.id === showId);
        // Ensure targetShow is defined before proceeding
        if (targetShow) {
          console.log('Comedian:', comedian.comedianInfo.name, 'Show:', targetShow, 'Position:', position);
          // If the comedian is available for the selected show, add them to the comicArray
          if (targetShow.club === (selectedCell.show.club === 'downtown' ? 'downtown' : 'south') && position && position !== 'X') {
            comicArray.push({ showId, type: position, comic: comedian.comedianInfo.name });
          }
        }
      });
    });

    // Only submit if there are valid entries
    if (comicArray.length > 0) {
      // Iterate over unique show IDs and save comics for each show
      const uniqueShowIds = Array.from(new Set(comicArray.map(comic => comic.showId)));
      uniqueShowIds.forEach(showId => {
        const comicsForShow = comicArray.filter(comic => comic.showId === showId);
        console.log('Saving comics for show:', showId, comicsForShow);
        // Assuming 'db' and 'setDoc' are already imported and defined somewhere in your code
        setDoc(doc(db, `publishedShows/${showId}`), {
          bookedshow: selectedCell.show,
          fireOrder: Date.now(),
          comicArray: comicsForShow
        });
      });
      alert('Show published!');
    } else {
      alert('There are no valid entries to submit.');
    }
  } else {
    alert('Please select a cell before publishing.');
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
<button onClick={() => publishShow()}>Submit</button>
      </div>
    );
  };

  export default ComediansGrid;
