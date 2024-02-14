  import { collection, doc, DocumentData, getDocs, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
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
    const [trig, setTrig] = useState(true)


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
    const [comicHistory, setComicHistory] = useState<DocumentData[]>([]);

    const [allNotes, setAllNotes] = useState([]);


    useEffect(() => {
      const fetchData = async () => {
        const docRef = query(collection(db, 'publishedShows'));
        const docSnap = await getDocs(docRef);
        if (!docSnap.empty) {
          const data = docSnap.docs.map(doc => doc.data());
          setComicHistory(data); // Ensure data is treated as DocumentData[]

          console.log(data)
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const docRef = query(collection(db, 'comediansForAdmin'));
          const docSnap = await getDocs(docRef);
          if (!docSnap.empty) {
            const comedianData = docSnap.docs.map(doc => doc.data());
            setComediansNow(comedianData); // Update comedians state with fetched data
    
            // Extract all notes
            console.log(comedianData)
            const notes = comedianData.map(comedian => {
              if (comedian.note) {
                return `${comedian.comedianInfo.name} + ${comedian.note}`
              }
            }).filter(note => note);
            setAllNotes(notes);
    
            // Log data to ensure retrieval
            console.log(comedianData);
          }
        } catch (error) {
          console.error('Error fetching comedians:', error);
        }
      };
    
      fetchData();
    }, []);
    

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
    
    const handlePopupSelection = (position: string) => {
      if (currentCellKey && selectedCells[currentCellKey]) {
        const { comedian, show } = selectedCells[currentCellKey];
        console.log("Selected cell:", selectedCells[currentCellKey]);
        
        const updatedCells = { ...selectedCells };
    
        // Update the appropriate showsAvailable object based on the show's club
        const updatedShowsAvailable = show.club === 'downtown' 
          ? { ...comedian.comedianInfo.showsAvailabledowntown }
          : { ...comedian.comedianInfo.showsAvailablesouth };
        console.log("Updated shows available:", updatedShowsAvailable);
    
        // Update the position for the specific show in the appropriate showsAvailable object
        if (updatedShowsAvailable[show.day.toLowerCase()]?.includes(show.id)) {
          updatedShowsAvailable[show.day.toLowerCase()][show.id] = position;
          console.log("Position updated for show:", updatedShowsAvailable[show.day.toLowerCase()][show.id]);
        }
    
        // Update the selectedCells state with the new position
        updatedCells[currentCellKey] = {
          ...selectedCells[currentCellKey],
          selectedPosition: position,
          comedian: {
            ...selectedCells[currentCellKey].comedian,
            comedianInfo: {
              ...(selectedCells[currentCellKey].comedian.comedianInfo),
              showsAvailabledowntown: show.club === 'downtown' 
                ? updatedShowsAvailable
                : selectedCells[currentCellKey].comedian.comedianInfo.showsAvailabledowntown,
              showsAvailablesouth: show.club === 'south' 
                ? updatedShowsAvailable 
                : selectedCells[currentCellKey].comedian.comedianInfo.showsAvailablesouth
            }
          }
        };
        console.log("Updated cell:", updatedCells[currentCellKey]);
    
        setSelectedCells(updatedCells); // Update the selectedCells state
        setShowPopup(false); // Close the popup
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
  .map(show => {
    const cellKey = `${comedian.comedianInfo.id}-${show.id}`;
    const comicHistoryItem = comicHistory.find(item => item.bookedshow.id === show.id);
    let assignedType = null;
    if (comicHistoryItem) {
      const comic = comicHistoryItem.comicArray.find((comic: { comic: any; }) => comic.comic === comedian.comedianInfo.name);
      if (comic) {
        assignedType = comic.type;
      }
    }

    const isAvailable = comedian.comedianInfo.showsAvailabledowntown &&
                        comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()] &&
                        comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id);


    return (
      <div
        className={`cell ${assignedType || (isAvailable ? 'available' : '')}`} // Adding comic type as a class
        key={cellKey}
        onClick={(event) => handleCellClick(event, comedian, show)}
      >
        {/* {selectedCells[cellKey]?.selectedPosition || (isAvailable ? 'X' : '')} */}

        {selectedCells[cellKey]?.selectedPosition || assignedType || (isAvailable ? 'X' : '')} {/* Display assigned type or 'X' if available */}
      </div>
    );
  })
}

{/* South Club show cells */}
{shows
  .filter(show => show.club === 'south')
  .map(show => {
    const cellKey = `${comedian.comedianInfo.id}-${show.id}`;
    const comicHistoryItem = comicHistory.find(item => item.bookedshow.id === show.id);
    let assignedType = null;
    if (comicHistoryItem) {
      const comic = comicHistoryItem.comicArray.find((comic: { comic: any; }) => comic.comic === comedian.comedianInfo.name);
      if (comic) {
        assignedType = comic.type;
      }
    }

    const isAvailable = comedian.comedianInfo.showsAvailablesouth &&
                        comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()] &&
                        comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id);


    return (
      <div
        className={`cell ${assignedType || (isAvailable ? 'available' : '')}`} // Adding comic type as a class
        key={cellKey}
        onClick={(event) => handleCellClick(event, comedian, show)}
      >
        {selectedCells[cellKey]?.selectedPosition || assignedType || (isAvailable ? 'X' : '')} {/* Display assigned type or 'X' if available */}
      </div>
    );
  })
}

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
<div className="notes-container">
  <h2>All Comedians' Notes</h2>
  <ul>
    {allNotes.map((note, index) => (
      <li key={index}>{note}</li>
    ))}
  </ul>
</div>
      </div>
    );
  };

  export default ComediansGrid;
