import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {UserData} from "./user-data";

@Injectable()
export class ConferenceData {
  data: any;

  constructor(public http: Http, public user: UserData) {}

  public load(): Promise<any> {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get("data/data.json").subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = this.processData(res.json());
        resolve(this.data);
      });
    });
  }

  public processData(data) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions

    data.tracks = [];

    // loop through each day in the schedule
    data.schedule.forEach(day => {
      // loop through each timeline group in the day
      day.groups.forEach(group => {
        // loop through each session in the timeline group
        group.sessions.forEach(session => {
          session.date = day.date; // add date for each session
          this.processSession(data, session);
        });
      });
    });

    data.speakers.forEach(user => {
      user.profiles.forEach(profile => {
        profile.sport = data.sports.find(s => profile.sportName === s.name); // find sport and assign to sport profile
		//if (profile.calendar) {alert('existe');} else {alert('no existe');}
		profile.calendar = profile.calendar || user.calendar;
      });
    });

    return data;
  }

  public processSession(data, session) {
    // loop through each speaker and load the speaker data
    // using the speaker name as the key
    session.speakers = [];
    if (session.speakerNames) {
      session.speakerNames.forEach(speakerName => {
          // find one speaker for each speakername
        let speaker = data.speakers.find(s => s.name === speakerName);
        if (speaker) {
          session.speakers.push(speaker); // add speaker to session
          speaker.sessions = speaker.sessions || []; // initialize
          speaker.sessions.push(session); // add session to speaker
        }
      });
     }

    session.hosts = [];
    if (session.hostNames) {
      session.hostNames.forEach(hostName => {
          // find one speaker for each speakername
        let host = data.speakers.find(s => s.name === hostName);
        if (host) {
          session.hosts.push(host); // add host to session
       //   host.sessions = host.sessions || []; //initialize
      //    host.sessions.push(session);//add session to host
        }
      });
    }

    session.invitedUsers = [];
    if (session.invitedNames) {
      session.invitedNames.forEach(invitedName => {
          // find one speaker for each speakername
        let invitedUser = data.speakers.find(s => s.name === invitedName);
        let response: string = "no response";
        if (invitedUser && session.rsvps) {
             let r = session.rsvps.find(r => r.name === invitedName);
             if (r) {response = r.response; };
        }

        let responseUser = {"user": invitedUser, "response": response};

        if (invitedUser) {
          session.invitedUsers.push(responseUser); // add invited to session
       //   host.sessions = host.sessions || []; //initialize
      //    host.sessions.push(session);//add session to host
        }
      });
    }

    if (session.tracks) {
      session.tracks.forEach(track => {
        if (data.tracks.indexOf(track) < 0) {
          data.tracks.push(track); // add track to a list
        }
      });
    }
  }

  public getTimeline(dayIndex: number, queryText: string= "", excludeTracks: Array<string>= [], segment: string= "all", userName: string) {
    return this.load().then(data => {

      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, " "); // replace , or . or - with spaces globally
      let queryWords = queryText.split(" ").filter(w => w.trim().length > 0); // filter only words

      day.groups.forEach(group => {
        group.hide = true; // all groups hidden

        group.sessions.forEach(session => {
          // check if this session should show or not
         this.filterSession(session, queryWords, excludeTracks, segment, userName);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });

      return day;
    });
  }

  public hasSession(dayIndex: number) {
      return this.load().then(data => {
         return (data.schedule.length - 1 >= dayIndex && dayIndex >= 0 );
      });
     }

  public filterSession(session, queryWords: Array<string>, excludeTracks: Array<any>, segment: string, userName: string) {

    let matchesQueryText: boolean = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks: boolean = false;
    session.tracks.forEach(trackName => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segment is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment: boolean = false;
    if (segment === "favorites") {
      if (this.user.hasFavorite("sessions", session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    let matchesUserName: boolean = false;
    session.speakerNames.forEach(Name => {
      if (Name === userName) {
        matchesUserName = true;
      }
    });

    let matchesHosts: boolean = false;
    session.hosts.forEach(Name => {
      if (Name === userName) {
        matchesHosts = true;
      }
    });

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment && (matchesUserName || matchesHosts || session.public));
  }

  public getTracks() {
    return this.load().then(data => {
      return data.tracks.sort();
    });
  }

  public getMap() {
    return this.load().then(data => {
      return data.map;
    });
  }

  public getSportmen(queryText: string = "", excludedGenders: Array<string>= [], excludedLevels: Array<string>= [], excludedAgeCategories: Array<string>= [], excludedSports: Array<string> = [], segment: string = "all"): Promise<Array<ISportman>> {
      queryText = queryText.toLowerCase().replace(/,|\.|-/g, " "); // replace , or . or - with spaces globally
      let queryWords: string[] = queryText.split(" ").filter(w => w.trim().length > 0); // filter only words

      return this.load().then(data => {
            let speakers: Array<ISportman> = data.speakers;
            speakers.forEach(sportman => {this.filterSportman(sportman, queryWords, excludedGenders, excludedLevels, excludedAgeCategories, excludedSports, segment); });

            return speakers.sort((a, b) => {// name a vs name b
                let aName = a.name.split(" ").pop(); // separate name and surname in a array, obtain surname
                let bName = b.name.split(" ").pop(); // separate name and surname in a array, obtain surname
                return aName.localeCompare(bName); // compare and return sorted
            });
      });

  }

  public filterSportman(sportman: ISportman, queryWords: string[], excludedGenders: string[], excludedLevels: string[], excludedAgeCategories: string[], excludedSports: string[], segment: string) {

    let matchesQueryText: boolean = false;
    if (queryWords.length) {
      // of any query word is in the sportman name than it passes the query test
      queryWords.forEach(queryWord => {
        if (sportman.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this sportman passes the query test
      matchesQueryText = true;
    }

    // if none of the sportmen's sports are excluded passes the match
    let matchesSports: boolean = false;
    sportman.profiles.forEach(profile => {
    if (excludedSports.indexOf(profile.sportName) === -1) {
        matchesSports = true;
    }
    });

     // if none of the sportmen's gender are excluded passes the match
     let matchesGenders: boolean = false;
     if (excludedGenders.indexOf(sportman.gender) === -1) {matchesGenders = true; };

     // if none of the sportmen's age categories are excluded passes the match
     let matchesAgeCategories: boolean = false;
     if (excludedAgeCategories.indexOf(sportman.agecategory) === -1) {matchesAgeCategories = true; };

    // if none of the sportmen's levels are excluded passes the match
    let matchesLevels: boolean = false;
    sportman.profiles.forEach(profile => {
      if (excludedLevels.indexOf(profile.level) === -1) {
        matchesLevels = true;
      }
    });

    // if the segment is 'favorites', but sportman is not a user favorite
    // then this sportman does not pass the segment test
    let matchesSegment: boolean = false;
    if (segment === "favorites") {
      if (this.user.hasFavorite("sportmen", sportman.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    sportman.hide = !(matchesQueryText && matchesSports && matchesGenders && matchesLevels && matchesAgeCategories && matchesSegment);
  }

  public getSports() {
    return this.load().then(data => {
      return data.sports;

    });
  }

    public getLevels() {
        return new Promise(resolve => resolve([{name: "Beginner"}, {name: "Basic"}, {name: "Intermediate"}, {name: "Advance"}, {name: "Expert"}]));
    }

    public getAgeCategories() {
       return new Promise(resolve => resolve([{name: "Child"}, {name: "Adult"}]));
    }

    public getGenders() {
        return new Promise(resolve => resolve([{name: "Male"}, {name: "Female"}]));
    }
}
