import {IonicApp, Page, Modal, Alert, NavController, ItemSliding} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {SessionDetailPage} from '../session-detail/session-detail';

@Page({
  templateUrl: "build/pages/event-list/event-list.html",
})


export class EventList {
dayIndex: number = 0;
queryText: string = "";
segment: string = "all";
excludedTracks: Array<any> = [];
excludedSecurity: Array<any> = ['Private'];
excludedStatus: Array<any> = ['Closed'];

filterCriteria: Object={};

shownSessions: number = 0;
groups = [];

date: string;

  constructor(private app: IonicApp, private nav: NavController, private confData: ConferenceData, private user: UserData) {
   this.filterCriteria = {excludedTracks: this.excludedTracks, excludedSecurity: this.excludedSecurity, excludedStatus: this.excludedStatus};
    this.updateSchedule();
  }


  onPageDidEnter() {
    this.app.setTitle('Schedule');
  }

  updateSchedule() {
    this.user.getUserName().then(username => {

    this.confData.getTimeline(this.dayIndex, this.queryText, this.filterCriteria, this.segment, username).then(data => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
      this.date = data.date;
    });
    });
  }

  presentFilter() {
    let modal = Modal.create(ScheduleFilterPage, this.filterCriteria);
    this.nav.present(modal);

    modal.onDismiss(data => {
      if (data) {
        this.excludedTracks = data.excludedTracks;
        this.excludedSecurity = data.excludedSecurity;
        this.excludedStatus = data.excludedStatus;

        this.filterCriteria = {excludedTracks: this.excludedTracks, excludedSecurity: this.excludedSecurity, excludedStatus: this.excludedStatus};
        this.updateSchedule();
      }
    });

  }

  goToSessionDetail(sessionData) {
    // go to the session detail page
    // and pass in the session data
    this.nav.push(SessionDetailPage, sessionData);
  }

  back() {
    if (this.dayIndex > 0) {;
        this.confData.hasSession(this.dayIndex - 1).then(v => {if (v) {
                this.date = "";
                this.groups = [];
                this.shownSessions = 0;
                this.dayIndex--;
                this.updateSchedule(); }
            });
    }
  }

  next() {
    if (this.dayIndex < this.shownSessions) {;
        this.confData.hasSession(this.dayIndex + 1).then(v => {if (v) {
                this.date = "";
                this.groups = [];
                this.shownSessions = 0;
                this.dayIndex++;
                this.updateSchedule(); }
            });
    }
    }

  addFavorite(slidingItem: ItemSliding, sessionData) {

    if (this.user.hasFavorite('sessions',sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // create an alert instance
        let alert = Alert.create({
        title: 'Favorite already added',
        message: 'Would you like to remove this session from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // they clicked the cancel button, do not remove the session
              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          },
          {
            text: 'Remove',
            handler: () => {
              // they want to remove this session from their favorites
        this.user.removeFavorite('sessions',sessionData.name);

              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          }
        ]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);

    } else {
      // remember this session as a user favorite
    this.user.addFavorite('sessions',sessionData.name);

      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);
    }

  }

}
