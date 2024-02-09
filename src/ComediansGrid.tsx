import React from 'react';

const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
  console.log(comedians, shows);

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

  // Render comedians under respective headers
  return (
    <div className="grid-container">
      {/* Header row */}
      <div className="row">
        <div className="cell"></div> {/* Empty cell for spacing */}
        <div className="cell header">Downtown</div>
        <div className="cell header">South</div>
      </div>

      {/* Iterate through shows to display show information for each Comic Type */}
      {Object.entries(groupedComedians).map(([type, comediansOfType]) => {
        return (
          <React.Fragment key={type}>
            {/* Header for Comic Type */}
            <div className="row">
              <div className="cell header" style={{ backgroundColor: '#ccc' }}>{type.replace(/([A-Z])/g, ' $1').trim()}</div>
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
            {comediansOfType.map((comedian) => (
              <div className="row" key={comedian.comedianInfo.id}>
                <div className="cell">{comedian.comedianInfo.name}</div>
                {/* Iterate through shows to determine if comedian is available */}
                {shows.map((show) => (
                  <div className="cell" key={`${comedian.comedianInfo.id}-${show.id}`}>
                    {((comedian.comedianInfo.showsAvailabledowntown && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id)) ||
                      (comedian.comedianInfo.showsAvailablesouth && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id))) ?
                      'X' : ''}
                  </div>
                ))}
              </div>
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ComediansGrid;
