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

    const [currentCellKey, setCurrentCellKey] = useState<string>('');


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

    const handleCellClick = (event: React.MouseEvent<HTMLDivElement>, comedian: any, show: any) => {
      const cellKey = `${comedian.comedianInfo.id}-${show.id}`;
      setCurrentCellKey(cellKey); // Store the cell key of the clicked cell
    
      const cellData = selectedCells[cellKey];
      
      setPopupPosition({ x: event.clientX, y: event.clientY });
      setSelectedCells({
        ...selectedCells,
        [cellKey]: { comedian, show, selectedPosition: cellData ? cellData.selectedPosition : null }
      });
      setShowPopup(true);
    };
    
    // Function to handle popup selection
    const handlePopupSelection = (position: string) => {
      if (currentCellKey && selectedCells[currentCellKey]) {
        const { comedian, show } = selectedCells[currentCellKey];
        const updatedCells = { ...selectedCells };
    
        const updatedShowsAvailableDowntown = { ...comedian.comedianInfo.showsAvailabledowntown };
        const updatedShowsAvailableSouth = { ...comedian.comedianInfo.showsAvailablesouth };
    
        if (show.club === 'downtown' && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()]?.includes(show.id)) {
          updatedShowsAvailableDowntown[show.day.toLowerCase()][show.id] = position;
        } else if (show.club === 'south' && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()]?.includes(show.id)) {
          updatedShowsAvailableSouth[show.day.toLowerCase()][show.id] = position;
        }
    
        updatedCells[currentCellKey] = {
          ...selectedCells[currentCellKey],
          selectedPosition: position
        };
    
        setSelectedCells(updatedCells);
        setShowPopup(false);
      }
    };
    




const publishShow = async () => {
  const comicArray: { showId: string; type: unknown; comic: any }[] = [];

  // Iterate through all selected cells
  Object.values(selectedCells).forEach((selectedCell) => {
    const availableShowsDowntown =
      selectedCell.comedian.comedianInfo.showsAvailabledowntown[selectedCell.show.day.toLowerCase()] || {};
    const availableShowsSouth =
      selectedCell.comedian.comedianInfo.showsAvailablesouth[selectedCell.show.day.toLowerCase()] || {};
    const availableShows = { ...availableShowsDowntown, ...availableShowsSouth };

    // Iterate through all available shows for the comedian
    Object.entries(availableShows).forEach(([showId, position]) => {
      const targetShow = shows.find((show) => show.id === showId);
      // Ensure targetShow is defined before proceeding
      if (targetShow) {
        console.log('Comedian:', selectedCell.comedian.comedianInfo.name, 'Show:', targetShow, 'Position:', position);
        // If the comedian is available for the selected show, add them to the comicArray
        if (
          targetShow.club === (selectedCell.show.club === 'downtown' ? 'downtown' : 'south') &&
          position &&
          position !== 'X'
        ) {
          // Push comedian data into comicArray with the corresponding showId
          comicArray.push({ showId, type: position, comic: selectedCell.comedian.comedianInfo.name });
        }
      }
    });
  });

  // Only submit if there are valid entries
  if (comicArray.length > 0) {
    // Group comedian data by showId
    const comicsByShowId: { [showId: string]: { type: unknown; comic: any }[] } = {};
    comicArray.forEach(({ showId, type, comic }) => {
      if (!comicsByShowId[showId]) {
        comicsByShowId[showId] = [];
      }
      comicsByShowId[showId].push({ type, comic });
    });

    // Save comedian data for each showId
    Object.entries(comicsByShowId).forEach(([showId, comics]) => {
      console.log('Saving comics for show:', showId, comics);
      // Assuming 'db' and 'setDoc' are already imported and defined somewhere in your code
      setDoc(doc(db, `publishedShows/${showId}`), {
        bookedshow: shows.find((show) => show.id === showId),
        fireOrder: Date.now(),
        comicArray: comics,
      });
    });

    alert('Show published!');
  } else {
    alert('There are no valid entries to submit.');
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
        // Render Popup
        {showPopup && (
  <Popup
    position={popupPosition}
    onClose={(position) => handlePopupSelection(position)} // Only pass the selected position
  />
)}

<button onClick={() => publishShow()}>Submit</button>
      </div>
    );
  };

  export default ComediansGrid;
