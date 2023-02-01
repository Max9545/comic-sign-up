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
  showsAvailableDowntown: Week,
  showsAvailableSouth: Week,
  payAmount: number
}

export interface ShowToBook {
  key: number, 
  day: string, 
  time: string, 
  pay: string, 
  currentClub: string, 
  availableComedian: string, 
  date: string, 
  id: string,
  headliner: string,
  club: string
}


 