interface IStatistics {
    points: number;
    games: number;
    won: number;
    lost: number;
    drawn: number;
}

interface IZone {
    sector: string;
    loc: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
}

interface IProfile {
   sportName: string;
   level: string;
   ranking: number;
   statistics: IStatistics;
}

interface ISportman    {
      name: string;
      gender: string;
      agecategory: string;
      status: string;
      email: string;
      birthdate: Date;
      reputation: number;
      receivenotification: boolean;
      publiscalendar: boolean;
      zones: IZone[];
      calendar: any;
      profiles: IProfile[];
      profilePic: string;
      twitter: string;
      about: string;
      location: string;
      hide?: boolean;
}