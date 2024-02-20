  import { collection, doc, DocumentData, getDocs, query, setDoc, updateDoc } from 'firebase/firestore';
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
    // const [trig, setTrig] = useState(true)


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

    const [allNotes, setAllNotes] = useState<any[]>([]);
    const [override, setOverride] = useState<boolean>(false); // Step 1


    useEffect(() => {
      const fetchData = async () => {
        const docRef = query(collection(db, 'publishedShows'));
        const docSnap = await getDocs(docRef);
        if (!docSnap.empty) {
          const data = docSnap.docs.map(doc => doc.data());
          setComicHistory(data); // Ensure data is treated as DocumentData[]
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
                return `${comedian.comedianInfo.name} - ${comedian.note}`
              }
            }).filter(note => note !== undefined && note !== null)
            setAllNotes(notes);
          }
        } catch (error) {
          console.error('Error fetching comedians:', error);
        }
      };
    
      fetchData();
    }, []);
    

    const handleCellClick = (event: React.MouseEvent<HTMLDivElement>, comedian: any, show: any) => {
      const cellKey = `${comedian.comedianInfo.id}-${show.id}`;
      setCurrentCellKey(cellKey); 
    
      const cellData = selectedCells[cellKey];

      const isAvailableDown = comedian.comedianInfo.showsAvailabledowntown &&
                          comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()] &&
                          comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id);

      const isAvailableSouth = comedian.comedianInfo.showsAvailablesouth &&
                          comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()] &&
                          comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id)                        
      if (isAvailableSouth || isAvailableDown) {
        setPopupPosition({ x: event.clientX, y: event.clientY });
        setSelectedCells({
          ...selectedCells,
          [cellKey]: { comedian, show, selectedPosition: cellData ? cellData.selectedPosition : null }
        });
        setShowPopup(true);
      } else if (override) {
        setPopupPosition({ x: event.clientX, y: event.clientY });
        setSelectedCells({
          ...selectedCells,
          [cellKey]: { comedian, show, selectedPosition: cellData ? cellData.selectedPosition : null }
        });
        setShowPopup(true);
      } else {
        // Display a warning message or handle the case where the comedian is available for the show or override is false
        // For example:
        alert(`Comedian "${comedian.comedianInfo.name}" is either available for the show or override is not enabled.`);
      }
    };
    
  
    const handlePopupSelection = async (position: string) => {
      // if (override) { // Check if override is true
        let newComicArray: { showId: string, type: string, comic: string }[] = [];
    
        if (currentCellKey && selectedCells[currentCellKey]) {
          const { comedian, show } = selectedCells[currentCellKey];
    
          if (!comedian || !show) {
            console.error('Comedian or show is undefined.');
            return;
          }
    
          const updatedCells = { ...selectedCells };
          const columnCellKey = `${comedian.comedianInfo.id}-${show.id}`;
          const updatedCell = {
            ...selectedCells[currentCellKey],
            selectedPosition: position
          };
    
          updatedCells[columnCellKey] = updatedCell;
          try {
            const existingComicArray = comicHistory.length ? comicHistory.find(item => item.bookedshow.id === show.id) : undefined;
    
            if (existingComicArray) {
              const existingComicIndex = existingComicArray.comicArray.length ? existingComicArray.comicArray.findIndex((item: { showId: string, type: string, comic: string }) => item.comic === comedian.comedianInfo.name) : -1;
    
              if (existingComicIndex !== -1) {
                if (position === 'X' || '') {
                  existingComicArray.comicArray.splice(existingComicIndex, 1);
                } else {
                  existingComicArray.comicArray[existingComicIndex].type = position;
                }
              } else {
                if (position !== 'X' || '') {
                  existingComicArray.comicArray.push({
                    showId: show.id,
                    type: position,
                    comic: comedian.comedianInfo.name
                  });
                }
              }
            } else {
              if (position !== 'X' || '') {
                newComicArray = [{
                  showId: show.id,
                  type: position,
                  comic: comedian.comedianInfo.name
                }];
                comicHistory.push({ bookedshow: show, comicArray: newComicArray });
              }
            }
    
            console.log(existingComicArray);
            await setDoc(doc(db, 'publishedShows', show.id), {
              bookedshow: show,
              fireOrder: Date.now(),
              comicArray: existingComicArray ? existingComicArray.comicArray : newComicArray
            });
    
            setSelectedCells(updatedCells);
            setShowPopup(false);
          } catch (error) {
            console.error('Error updating data:', error);
          }
    
          // Update comedian's availability in comediansForAdmin collection
          try {
            console.log(`showsAvailable${show.club}${show.day.toLowerCase()}`, comedian.comedianInfo)
            const comedianDocRef = doc(db, 'comediansForAdmin', comedian.comedianInfo.id);
            await updateDoc(comedianDocRef, {
              [`showsAvailable${show.club}${show.day.toLowerCase()}`]: comedian.comedianInfo[`showsAvailable${show.club}`][`${show.day.toLowerCase()}`].filter((id: string) => id !== show.id)
            });
          } catch (error) {
            console.error('Error updating comedian availability:', error);
          }
        }
      // }
    };
    
const handleOverrideClick = () => {
  setOverride(prevState => !prevState); // Step 2: Toggle override state
};


    // Render comedians under respective headers
    return (
      <div className="grid-container">
        {/* Header row */}
        <button className={`override-button ${override ? 'red' : 'grey'}`} onClick={handleOverrideClick}>OVERRIDE AVAILABILITY</button>

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
    {showPopup && (
      <Popup
        position={popupPosition}
        onClose={(position) => handlePopupSelection(position)} // Only pass the selected position
      />
    )}
    
{/* <button className='delete-potential-comic' onClick={() => publishShow()}>Submit</button> */}
<div className='notes-list'>
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
