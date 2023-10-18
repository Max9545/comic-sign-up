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
  email: any;
  type: string;
  address?: string;
  phone?: string;
  clean?: boolean;
  familyFreindly?: boolean;
  downTownShowCount: number;
  southShowCount: number;
  showsAvailabledowntown: WeekInter;
  showsAvailablesouth: WeekInter;
  showsAvailabledowntownHistory: WeekInter;
  showsAvailablesouthHistory: WeekInter;

}

export interface ShowToBook {
  supportStatus: string;
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
  availableComics: any
}

 