export interface AvailableShow {
  showTime: string,
  showPay: string
}

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
  name: string;
  id: string;
  type: string;
  showsAvailabledowntown: WeekInter;
  showsAvailablesouth: WeekInter;
}

export interface ShowToBook {
  key: number, 
  day: string, 
  time: string, 
  currentClub: string, 
  availableComedian: object, 
  date: string, 
  id: string,
  headliner: string
  club: string,
  availability: boolean,
}

 