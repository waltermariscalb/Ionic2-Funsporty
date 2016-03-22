import {Page, NavParams, ViewController} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';

interface FilterToggle {
  name: string;
  icon?: string;
  isChecked: boolean;
}

@Page({
  templateUrl: 'build/pages/schedule-filter/schedule-filter.html'
})
export class ScheduleFilterPage {
  tracks: Array<FilterToggle> = [];
  status: Array<FilterToggle> = [];
  security: Array<FilterToggle> = [];

  constructor(private confData: ConferenceData, private navParams: NavParams, private viewCtrl: ViewController) {
     // passed in array of tracks that should be excluded (unchecked)
    let filterCriteria = this.navParams.data;

    this.confData.getTracks().then((trackNames: string[]) => {
        this.fillToggles(trackNames, this.tracks, filterCriteria.excludedTracks);
    });

    this.confData.getSecurities().then((securities: any[]) => {
        this.fillToggles(securities, this.security, filterCriteria.excludedSecurity);
    });

    this.confData.getStatus().then((status: any[]) => {
        this.fillToggles(status, this.status, filterCriteria.excludedStatus);
    });

  }

  private fillToggles(dataArray: any[], toggleArray: Array<FilterToggle>, excludedItem: string[]) {
      // fill a new array to toggle preference
    dataArray.forEach(item => {
        let name = item;
        if (name.name) {name = name.name; };
        let icon = "";
        if (item.images) {icon = item.images.mobileicon; };
        toggleArray.push({
        name: name, icon: icon,
        isChecked: (excludedItem.indexOf(name) === -1) // if it doesn't exist in the array is checked.
      });
      });
  }

  selectAll() {
    // reset all of the toggles to be checked
    this.tracks.forEach(track => {
      track.isChecked = true;
    });
  }

  deselectAll() {
    // reset all of the toggles to be checked
    this.tracks.forEach(track => {
      track.isChecked = false;
    });
  }


  applyFilters() {
    // Pass back a new array of track names to exclude
    let data: any = {};

    data.excludedTracks = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    data.excludedSecurity = this.security.filter(c => !c.isChecked).map(c => c.name);
    data.excludedStatus = this.status.filter(c => !c.isChecked).map(c => c.name);

    this.dismiss(data);
  }

  dismiss(data) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
