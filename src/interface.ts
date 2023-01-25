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


 