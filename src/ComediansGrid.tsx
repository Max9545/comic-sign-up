import React from 'react';

const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {
  console.log(comedians, shows);

  // Sort shows by club and then by day
  const sortedShows = shows.slice().sort((a, b) => {
    // Sort by club
    if (a.club !== b.club) {
      return a.club === 'downtown' ? -1 : 1;
    }
    // Sort by day
    if (a.day !== b.day) {
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return daysOfWeek.indexOf(a.day.toLowerCase()) - daysOfWeek.indexOf(b.day.toLowerCase());
    }
    // Sort by time if same day
    return a.time.localeCompare(b.time);
  });

  // Create headers for downtown and south clubs
  const downtownHeader = <div className="cell header">Downtown</div>;
  const southHeader = <div className="cell header">South</div>;

  return (
    <div className="grid-container">
      {/* Header row */}
      <div className="row">
        <div className="cell"></div> {/* Empty cell for spacing */}
        {downtownHeader}
        {southHeader}
      </div>

      {/* Shows row */}
      <div className="row">
        <div className="cell"></div> {/* Empty cell for spacing */}
        {sortedShows.map((show) => (
          <div className="cell" key={show.id}>
            {show.day} {show.time} {show.headliner} {show.club}
          </div>
        ))}
      </div>

      {/* Comedians and their available shows */}
      {comedians && comedians.map((comedian) => (
        <div className="row" key={comedian.comedianInfo.id}>
          <div className="cell">{comedian.comedianInfo.name}</div>
          {/* Iterate through all shows to determine if comedian is available */}
          {sortedShows.map((show) => (
            <div className="cell" key={`${comedian.comedianInfo.id}-${show.id}`}>
              {(comedian.comedianInfo.showsAvailabledowntown && comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()].includes(show.id)) ||
               (comedian.comedianInfo.showsAvailablesouth && comedian.comedianInfo.showsAvailablesouth[show.day.toLowerCase()].includes(show.id)) ? 'X' : ''}
            </div>
          ))}
        </div>  
      ))}
    </div>
  );
};

export default ComediansGrid;
