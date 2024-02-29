  import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
  import Popup from './Popup'; // Importing the Popup component
import ShowPopup from './ShowPopup';

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
    const [showToEdit, setShowToEdit] = useState<any>(null); // State to manage the show to be edited
    const [newShows, setNewShows] = useState([])


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
            // consolnpm starte.log(comedianData)
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
        alert(`Comedian "${comedian.comedianInfo.name}" is not available for this show. Enable override to change.`);
      }
    };
    
  
    const handlePopupSelection = async (position: string) => {
      // if (override) { // Check if override is true
        let newComicArray: { showId: string, type: string, comic: string }[] = [];

        if (position === 'remove') {
          await handleRemoveSubmission();
          
          // Clear the selected cell content
          if (currentCellKey && selectedCells[currentCellKey]) {
            // const updatedCells = { ...selectedCells };
            // updatedCells[currentCellKey].selectedPosition = '';
            const { comedian, show } = selectedCells[currentCellKey];

            const updatedCells = { ...selectedCells };
            const columnCellKey = `${comedian.comedianInfo.id}-${show.id}`;
            const updatedCell = {
              ...selectedCells[currentCellKey],
              selectedPosition: position
            };
      
            updatedCells[columnCellKey] = updatedCell;
            setSelectedCells(updatedCells);
            console.log(updatedCells[currentCellKey])
            setShowPopup(false);
          }
        } else {
          if (currentCellKey && selectedCells[currentCellKey]) {
            const { comedian, show } = selectedCells[currentCellKey];
      
            if (!comedian || !show) {
              console.error('Comedian or show is undefined.');
              return;
            }
      
            const updatedCells = { ...selectedCells };
            const columnCellKey = `${comedian.comedianInfo.uid || comedian.comedianInfo.id}-${show.id}`;
            const updatedCell = {
              ...selectedCells[currentCellKey],
              selectedPosition: position
            };
      console.log(columnCellKey, comedian.comedianInfo)
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
              const comedianDocRef = doc(db, 'comediansForAdmin', comedian.comedianInfo.id);
              
              // Generate dynamic keys for accessing comedian's availability
              const clubKey = `showsAvailable${show.club}`;
              const dayKey = show.day.toLowerCase();
              
              // Filter out the show id from the appropriate day's availability array
              if (!comedian.comedianInfo[clubKey][dayKey].includes(show.id)) {
                comedian.comedianInfo[clubKey][dayKey].push(show.id)

              }
              
              const updatedAvailability = comedian.comedianInfo[clubKey][dayKey];
                if (!updatedAvailability.includes(show.id)) {
                  updatedAvailability.push(show.id);
                }

              
              // .filter((id) => id !== show.id);
              
              // Create a copy of comedianInfo with updated availability
              const updatedComedianInfo = {
                  ...comedian.comedianInfo,
                  [clubKey]: {
                      ...comedian.comedianInfo[clubKey],
                      [dayKey]: updatedAvailability
                  }
              };
          
              // Update the document with the new availability for the specified comedian
              await updateDoc(comedianDocRef, {
                  comedianInfo: updatedComedianInfo
              });
          } catch (error) {
              console.error('Error updating comedian availability:', error);
          }
        }    
      }
      // }
console.log(trig)
      // setTrig(!trig)
      
    };

    const handleRemoveSubmission = async () => {
      if (currentCellKey && selectedCells[currentCellKey]) {
        const { comedian, show } = selectedCells[currentCellKey];
        
        try {
          // Remove the comedian from the show
          const comedianDocRef = doc(db, 'comediansForAdmin', comedian.comedianInfo.id);
          const clubKey = `showsAvailable${show.club}`;
          const dayKey = show.day.toLowerCase();
          
          const updatedAvailability = comedian.comedianInfo[clubKey][dayKey].filter((id: string) => id !== show.id);
          const updatedComedianInfo = {
            ...comedian.comedianInfo,
            [clubKey]: {
              ...comedian.comedianInfo[clubKey],
              [dayKey]: updatedAvailability
            }
          };
          
          await updateDoc(comedianDocRef, {
            comedianInfo: updatedComedianInfo
          });
          
          // Remove the comedian's assignment from the published show
          const publishedShowDocRef = doc(db, 'publishedShows', show.id);
          const publishedShowDoc = await getDoc(publishedShowDocRef); // Use getDoc instead of getDocs
          if (publishedShowDoc.exists()) {
            const publishedShowData = publishedShowDoc.data();
            const updatedComicArray = publishedShowData.comicArray.filter((comic: any) => comic.comic !== comedian.comedianInfo.name);
            
            if (updatedComicArray.length === 0) {
              await deleteDoc(publishedShowDocRef);
            } else {
              await updateDoc(publishedShowDocRef, {
                comicArray: updatedComicArray
              });
            }
          }
          
          // Update state or perform other actions as needed
          
        } catch (error) {
          console.error('Error handling remove submission:', error);
        }
      }
    };
    
    
const handleOverrideClick = () => {
  setOverride(prevState => !prevState); // Step 2: Toggle override state
};

const handleShowClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, showInfo: object) => {
  console.log(showInfo)
  if (window.confirm('Do you want to  edit this show?')) {
    const x = e.clientX;
    const y = e.clientY;

    // Set the popup position
    setPopupPosition({ x, y });

    setShowToEdit(showInfo); 
    
  }
}

const handleSaveShow = async (editedShow: any) => {





  try {
    // Update the show details in the database
    const showToEditRef = doc(db, 'publishedShows', showToEdit.id);
    const showToEditDoc = await getDoc(showToEditRef);
    const showToEditData = showToEditDoc.data();

    if (showToEditData) {
      const updatedShow = {
        ...showToEditData,
        bookedshow: editedShow // Replace the bookedShow with the one from editedShow
      };

      await updateDoc(showToEditRef, updatedShow);
      
      // Update state or perform other actions as needed
      setShowToEdit(null); // Clear the show to be edited
      // Optionally, you can update the local state with the edited show data
    } else {
      console.log("Show to edit not found in database.");
    }
  } catch (error) {
    console.error('Error updating show:', error);
  }




  try {
    const docRef = query(collection(db, `shows for week`), orderBy('fireOrder', 'desc'), limit(1));
    const docSnapshot = await getDocs(docRef);
    const docData = docSnapshot.docs[0].data();
    let thisWeek = docData.thisWeek;
    // await updateDoc(doc(db, 'publishedShows', showToEdit.id), editedShow);

    // Find the index of the editedShow in the thisWeek array
    const index = thisWeek.findIndex((item: any) => item.id === editedShow.id);

    if (index !== -1) {
      // Replace the existing show with the editedShow
      thisWeek[index] = editedShow;

      // Update the document in the database with the modified thisWeek array
      await updateDoc(doc(db, `shows for week`, docSnapshot.docs[0].id), {
        thisWeek: thisWeek
      });

      console.log("Show updated successfully.");
    } else {
      console.log("Edited show not found in thisWeek array.");
    }

    setShowToEdit(null); // Clear the show to be edited
    // Optionally, you can update the local state with the edited show data
  } catch (error) {
    console.error('Error updating show:', error);
  }

  const docRef = query(collection(db, `shows for week`), orderBy('fireOrder', 'desc'), limit(1));
  const docSnapshot = await getDocs(docRef);
  const docData = docSnapshot.docs[0].data();
  console.log(docData)
  const thisWeek = docData.thisWeek;
  
  setNewShows(thisWeek)


};



return (
  <>
      <button className={`override-button ${override ? 'red' : 'grey'}`} onClick={handleOverrideClick}>OVERRIDE AVAILABILITY</button>
    <div className="grid-container">
    {/* Header row */}

    {/* Grid for Downtown club */}
    <div className="downtown-grid">
      {/* Header row for Downtown */}
      <div className="row header">
        <div className="cell"></div> {/* Empty cell for spacing */}
        <div className="cell">Downtown</div>
      </div>

      {/* Iterate through shows to display show information for Downtown club */}
      {Object.entries(groupedComedians).map(([type, comediansOfType]: [string, any[]], typeIndex) => (
        <React.Fragment key={type}>
          {/* Header row for Comic Type */}
          <div className="row type-header">
            <div className="cell type-cell">{type.replace(/([A-Z])/g, ' $1').trim()}</div>
            {/* Downtown show information */}
            {(newShows.length ? newShows : shows)
              .filter(show => show.club === 'downtown')
              .map(show => (
                <div className="cell" 
                key={`${type}-${show.id}`}
                onClick={(event) => handleShowClick(event, show)}
                >
                  {`${show.day.slice(0, 3)} ${show.time.slice(0, -2)}`}
                  <br></br>
                  {`${show.headliner.split(" ")[show.headliner.split(" ").length - 1]}`}
                  <br></br>
                  {`down`}
                </div>
              ))}
          </div>
          {/* Comedians of this type for Downtown club */}
          {comediansOfType
            .sort((a, b) => a.comedianInfo.name.localeCompare(b.comedianInfo.name)) // Sort comedians alphabetically by name
            .map((comedian: any, index: number) => (
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
                        {selectedCells[cellKey]?.selectedPosition == 'remove' ? '' : assignedType || selectedCells[cellKey]?.selectedPosition || (isAvailable ? 'X' : '')}
                      </div>
                    );
                  })
                }
              </div>
            ))
          }
        </React.Fragment>
      ))}
    </div>

    {/* Grid for South club */}
    <div className="south-grid">
      {/* Header row for South Club */}
      <div className="row header">
        <div className="cell"></div> {/* Empty cell for spacing */}
        <div className="cell">South</div>
      </div>

      {/* Iterate through shows to display show information for South club */}
      {Object.entries(groupedComedians).map(([type, comediansOfType]: [string, any[]], typeIndex) => (
        <React.Fragment key={type}>
          {/* Header row for Comic Type */}
          <div className="row type-header">
            <div className="cell type-cell">{type.replace(/([A-Z])/g, ' $1').trim()}</div>
            {/* South Club show information */}
            {(newShows.length ? newShows : shows)
              .filter(show => show.club === 'south')
              .map(show => (
                <div className="cell" 
                key={`${type}-${show.id}`}
                onClick={(event) => handleShowClick(event, show)}
                >
                  {`${show.day.slice(0, 3)} ${show.time.slice(0, -2)}`}
                  <br></br>
                  {`${show.headliner.split(" ")[show.headliner.split(" ").length - 1]}`}
                  <br></br>
                  {`${show.club}`}
                </div>
              ))}
          </div>
          {/* Comedians of this type for South club */}
          {comediansOfType
            .sort((a, b) => a.comedianInfo.name.localeCompare(b.comedianInfo.name)) // Sort comedians alphabetically by name
            .map((comedian: any, index: number) => (
              <div className={`row ${index % 2 === 0 ? 'even' : 'odd'}`} key={comedian.comedianInfo.id}>
                {/* Comedian name cell */}
                <div className="cell">{comedian.comedianInfo.name}</div>
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
                        {selectedCells[cellKey]?.selectedPosition == 'remove' ? '' : assignedType || selectedCells[cellKey]?.selectedPosition || (isAvailable ? 'X' : '')}
                      </div>
                    );
                  })
                }
              </div>
            ))
          }
        </React.Fragment>
      ))}
    </div>

    {/* Render Popup */}
    {showPopup && (
      <Popup
        position={popupPosition}
        onClose={(position) => handlePopupSelection(position)} 
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
    )}

     {/* Render Popup for editing show */}
     {showToEdit && (
        <ShowPopup
          position={popupPosition} // You can adjust the position as needed
          onClose={() => setShowToEdit(null)}
          onSave={handleSaveShow}
          show={showToEdit}
        />
      )}

    {/* <button className='delete-potential-comic' onClick={() => publishShow()}>Submit</button> */}
  </div>
    <div className='notes-list'>
      <h2>All Comedians' Notes</h2>
      <ul>
        {allNotes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  </>
);

  };

  export default ComediansGrid;
