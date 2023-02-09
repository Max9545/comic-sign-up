export interface WeekInter {
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
  showsAvailabledowntown: WeekInter,
  showsAvailablesouth: WeekInter,
  payAmount: number
}

export interface ShowToBook {
  key: number, 
  day: string, 
  time: string, 
  pay: string, 
  currentClub: string, 
  availableComedian: object, 
  date: string, 
  id: string,
  headliner: string
  club: string
}

 