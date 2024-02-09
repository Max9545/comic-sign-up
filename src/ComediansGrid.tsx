import React from 'react';

const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
  console.log(comedians, shows)

  return (
    <div className="grid-container">
      <div className="row">
        <div className="cell"></div> {/* Empty cell for spacing */}
        {shows && shows.map((show) => (
          <div className="cell" key={show.id}>{show.day} {show.time} {show.headliner} {show.club}</div>
        ))}
      </div>
      {comedians && comedians.map((comedian) => (
        <div className="row" key={comedian.comedianInfo.id}>
          <div className="cell">{comedian.comedianInfo.name}</div>
          {shows && shows.map((show) => (
            <div className="cell" key={`${comedian.comedianInfo.id}-${show.id}`}>
              {Object.values(comedian.comedianInfo.showsAvailabledowntown).concat(Object.values(comedian.comedianInfo.showsAvailablesouth)).flat().includes(show.id) ? 'X' : ''}
            </div>
          ))}
        </div>  
      ))}
    </div>
  );
};

export default ComediansGrid;



