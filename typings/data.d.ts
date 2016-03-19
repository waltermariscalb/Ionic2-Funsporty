interface IWeekday {
    status: string;
    from: string;
    to: string;
}

interface ICalendar {
    name: string;
    weekdays: Array<IWeekday>;
}

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
   calendar?: Array<ICalendar>;
   statistics?: IStatistics;
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
      calendar: Array<ICalendar>;
      profiles?: IProfile[];
      profilePic: string;
      twitter: string;
      about: string;
      location: string;
      hide?: boolean;
}

interface IRsvps {
    name: string;
    response: string;
}

interface ISession {
    id: number;
    sportNames: Array<string>;
    name: string;
    location: string;
    description: string;
    speakerNames: Array<string>;
    timeStart: string;
    timeEnd: string;
    tracks: Array<string>;
    center: string;
    lat: number;
    lng: number;
    invitedNames: Array<string>;
    rsvps: Array<IRsvps>;
    hostNames: Array<string>;
    winnerNames: Array<string>;
    resultName: string;
    results: Array<string>;
    public: boolean;
    status: string;
    min: number;
    max: number;
}

interface TimeSchedule {
    time: string;
    sessions: Array<ISession>;
}

interface ISession {
    date: string;
    groups: Array<TimeSchedule>;
}

interface IAllocation {
    single: boolean;
    group: boolean;
    collectivo: boolean;
}

interface IParticipants {
    min: number;
    max: number;
}

interface IImage {
    mobileicon: string;
    webicon: string;
}

interface ISport {
    name: string;
    type: string;
    status: string;
    images: IImage;
    allocation: IAllocation;
    participants: IParticipants;
}
