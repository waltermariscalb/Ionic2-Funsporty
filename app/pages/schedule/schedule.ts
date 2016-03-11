import {IonicApp, Page, Modal, Alert, NavController, ItemSliding} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {SessionDetailPage} from '../session-detail/session-detail';


@Page({
  templateUrl: 'build/pages/schedule/schedule.html'
})
export class SchedulePage {
dayIndex:number = 0;
queryText:string = '';
segment:string = 'all';
excludeTracks:Array<any> = [];
excludedSecurity:Array<any> = [];
excludedStatus:Array<any> = [];

shownSessions:number = 0;
groups = [];

date: string;

hasSessions:boolean = false;


  constructor(private app: IonicApp, private nav: NavController, private confData: ConferenceData, private user: UserData) {
    this.updateSchedule();
  }

  onPageDidEnter() {
    this.app.setTitle('Schedule');
  }

  updateSchedule() {
    this.user.getUserName().then(username => {
      
    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment, username).then(data => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
      this.date= data.date;
    });
    }); 
  }

  presentFilter() {
    let FilterCriteria:Object = {excludeTracks:this.excludeTracks,excludedSecurity:this.excludedSecurity,excludedStatus:this.excludedStatus}      
    let modal = Modal.create(ScheduleFilterPage, FilterCriteria);
    this.nav.present(modal);

    modal.onDismiss(data => {
      if (data) {
        this.excludeTracks = data.excludeTracks;
        this.excludedSecurity = data.excludedSecurity;
        this.excludedStatus = data.excludedStatus;
        this.updateSchedule();
      }
    });

  }

  goToSessionDetail(sessionData) {
    // go to the session detail page
    // and pass in the session data
    this.nav.push(SessionDetailPage, sessionData);
  }
  
  back(){
    this.date='';
    this.groups = [];
    this.shownSessions=0;
    if (this.dayIndex > 0) {this.dayIndex--};
    this.confData.hasSession(this.dayIndex).then(v => {if (v) {this.updateSchedule()}})  
  }

  next(){
    this.date='';
    this.groups = [];
    this.shownSessions=0;
    this.dayIndex++;
    this.confData.hasSession(this.dayIndex).then(v => {if (v) {this.updateSchedule()}})  
    }
  
  addFavorite(slidingItem:ItemSliding, sessionData) {

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
