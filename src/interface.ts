export interface Week {
  monday: string[],
  tuesday: string[],
  wednesday: string[],
  thursday: string[], 
  friday: string[],
  saturday: string[],
  sunday: string[]
}

export interface Comic {
  name: string,
  id: number,
  type: string,
  showsAvailable: Week,
  payAmount: number
}
//  export {}

//  [ {
//   name: "Max B",
//   id: comedians.length + 1,
//   type: 'Not Famous',
//   showsAvailable: {
//     monday: [],
//     tuesday: ['8:00'],
//     wednesday: [],
//     thursday: ['8:00'], 
//     friday: ['7:30', '9:45'],
//     saturday: ['7:30', '9:45'],
//     sunday: ['6:00']
//   },
//   payAmount: 0
// },{
//   name: "Norm",
//   id: comedians.length + 1,
//   type: 'Out of Town Pro',
//   showsAvailable: {
//     monday: ['8:00'],
//     tuesday: [],
//     wednesday: ['8:00'],
//     thursday: [], 
//     friday: ['9:45'],
//     saturday: ['7:30', '9:45'],
//     sunday: ['6:00', '8:30']
//   },
//   payAmount: 0
// }]


 