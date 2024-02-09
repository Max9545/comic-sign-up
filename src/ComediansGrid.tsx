// import React from 'react';
// // import './ComediansGrid.css';
// // import { Comedian, Show } from './interface';

// // interface Props {
// //   comedians: Comedian[];
// //   shows: Show[];
// // }
// //@ts-ignore
// const ComediansGrid: React.FC = ({ comedians, shows }) => {

// console.log(comedians, shows)


//   return (
//     <div className="grid-container">
//       <div className="row">
//         <div className="cell"></div> {/* Empty cell for spacing */}
//         {shows.map((show: { id: string | number | null | undefined; day: React.ReactNode; time: React.ReactNode; }) => (
//           <div className="cell" key={show.id}>{show.day} {show.time}</div>
//         ))}
//       </div>
//       {comedians && comedians.map((comedian: { id: string | number | null | undefined; name: React.ReactNode; showsAvailabledowntown: string | any[]; showsAvailablesouth: string | any[]; }) => (
//         <div className="row" key={comedian.id}>
//           <div className="cell">{comedian.name}</div>
//           {shows && shows.map((show: { id: string; }) => (
//             <div className="cell" key={`${comedian.id}-${show.id}`}>
//             {comedian.comedianInfo.showsAvailabledowntown.hasOwnProperty(show.id) || comedian.comedianInfo.showsAvailablesouth.hasOwnProperty(show.id) ? 'X' : ''}

//               {/* {comedian.comedianInfo.showsAvailabledowntown.includes(show.id) || comedian.comedianInfo.showsAvailablesouth.includes(show.id) ? 'X' : ''} */}
//             </div>
//           ))}
//         </div>  
//       ))}
//     </div>
//   );
// };

// export default ComediansGrid;





// import React from 'react';

// const ComediansGrid: React.FC<{ comedians: any[]; shows: any[] }> = ({ comedians, shows }) => {

//   console.log(comedians, shows)


//   return (
//     <div className="grid-container">
//       <div className="row">
//         <div className="cell"></div> {/* Empty cell for spacing */}
//         {shows && shows.map((show) => (
//           <div className="cell" key={show.id}>{show.day} {show.time} {show.headliner}</div>
//         ))}
//       </div>
//       {comedians && comedians.map((comedian) => (
//         <div className="row" key={comedian.comedianInfo.id}>
//           <div className="cell">{comedian.comedianInfo.name}</div>
//           {Array.isArray(shows) && shows.map((show) => (
//             <div className="cell" key={`${comedian.comedianInfo.id}-${show.id}`}>
//               {Array.isArray(comedian.showsAvailabledowntown) && comedian.comedianInfo.showsAvailabledowntown.hasOwnProperty(show.id) || 
//                Array.isArray(comedian.showsAvailablesouth) && comedian.comedianInfo.showsAvailablesouth.hasOwnProperty(show.id) ? 'X' : ''}
//             </div>
//           ))}
//         </div>  
//       ))}
//     </div>
//   );
// };

// export default ComediansGrid;

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



