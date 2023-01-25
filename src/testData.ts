const testData = {testComedians: [ {
  name: "Max B",
  id: 1,
  type: 'Not Famous',
  payAmount: 0,
  showsAvailableDowntown: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [], 
    friday: [],
    saturday: [],
    sunday: []
  },
  showsAvailableSouth: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [], 
    friday: [],
    saturday: [],
    sunday: []
  },
},{
  name: "Norm",
  id: 2,
  type: 'Out of Town Pro',
  payAmount: 0,
  showsAvailableDowntown: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [], 
    friday: [],
    saturday: [],
    sunday: []
  },
  showsAvailableSouth: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [], 
    friday: [],
    saturday: [],
    sunday: []
  },
}], testShows: [
  {day:'monday', 
  time:'7:30',
  pay:25},
  {day:'tuesday', 
  time:'6:00',
  pay:40}, {
  day:'tuesday', 
  time:'8:00',
  pay:40 
  },
  {day:'wednesday', 
  time:'7:30',
  pay:40},
  {day:'thursday', 
  time:'8:00',
  pay:50},
  {day:'friday', 
  time:'7:30',
  pay:40},
  {day:'saturday', 
  time:'7:30',
  pay:60},
  {day:'saturday', 
  time:'9:00',
  pay:70},
  {day:'sunday', 
  time:'7:30',
  pay:30}
]}



// exports.default = {}
export default testData
// export default testDay
