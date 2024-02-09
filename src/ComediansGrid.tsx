import React from 'react';

const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
  console.log(comedians, shows);

  // Group comedians by type
  const groupedComedians: { [type: string]: any[] } = {
    Pro: [],
    OutOfTownPros: [],
    AlmostFamous: [],
    Inactive: []
  };

  comedians.forEach((comedian) => {
    if (comedian.comedianInfo.type === 'pro') {
      groupedComedians.Pro.push(comedian);
    } else if (comedian.comedianInfo.type === 'OutOfTown') {
      groupedComedians.OutOfTownPros.push(comedian);
    } else if (comedian.comedianInfo.type === 'AlmostFamous') {
      groupedComedians.AlmostFamous.push(comedian);
    } else if (comedian.comedianInfo.type === 'Inactive') {
      groupedComedians.Inactive.push(comedian);
    }
  });

  // Render comedians under respective headers
  return (
    <div className="grid-container">
      {/* Header row */}
      <div className="row">
        <div className="cell"></div> {/* Empty cell for spacing */}
        <div className="cell header">Downtown</div>
        <div className="cell header">South</div>
      </div>

      {/* Header for show information under "Pro" */}
      {groupedComedians.Pro.length > 0 && (
        <div className="row">
          <div className="cell header" style={{ backgroundColor: '#ccc' }}>Pro</div>
          {shows.filter(show => show.club === 'downtown').map((show) => (
            <div className="cell header" key={show.id}>
              {show.day} {show.time} {show.headliner} {show.club}
            </div>
          ))}
          {shows.filter(show => show.club === 'south').map((show) => (
            <div className="cell header" key={show.id}>
              {show.day} {show.time} {show.headliner} {show.club}
            </div>
          ))}
        </div>
      )}

      {/* Comedians section */}
      {Object.entries(groupedComedians).map(([type, comediansOfType]) => (
        <React.Fragment key={type}>
          {/* Header for comedian type */}
          <div className="row">
            <div className="cell header" style={{ backgroundColor: '#ccc' }}>{type.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className="cell"></div> {/* Empty cell for spacing */}
          </div>
          {/* Comedians of this type */}
          {comediansOfType.map((comedian) => (
            <div className="row" key={comedian.comedianInfo.id}>
              <div className="cell">{comedian.comedianInfo.name}</div>
              {/* Iterate through shows to determine if comedian is available */}
              {shows.filter(show => show.club === 'downtown').map((show) => (
                <div className="cell" key={`${comedian.comedianInfo.id}-${show.id}`}>
                  {((comedian.comedianInfo.showsAvailabledowntown && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id)) ||
                    (comedian.comedianInfo.showsAvailablesouth && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id))) ? 
                    'X' : ''}
                </div>
              ))}
              {shows.filter(show => show.club === 'south').map((show) => (
                <div className="cell" key={`${comedian.comedianInfo.id}-${show.id}`}>
                  {((comedian.comedianInfo.showsAvailabledowntown && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id)) ||
                    (comedian.comedianInfo.showsAvailablesouth && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id))) ? 
                    'X' : ''}
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ComediansGrid;
