export interface AvailableShow {
  showTime: string,
  showPay: string
}

export interface WeekInter {
  monday: object[],
  tuesday: object[],
  wednesday: object[],
  thursday: object[], 
  friday: object[],
  saturday: object[],
  sunday: object[]
}

export interface Comic {
  name: string;
  id: string;
  type: string;
  showsAvailabledowntown: WeekInter;
  showsAvailablesouth: WeekInter;
  payAmount: number;
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
  club: string,
  availability: boolean,
}

 