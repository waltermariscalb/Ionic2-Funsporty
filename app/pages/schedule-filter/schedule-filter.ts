import {Page, NavParams, ViewController} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';

interface FilterToggle {
  name: string;
  isChecked: boolean;
}

@Page({
  templateUrl: 'build/pages/schedule-filter/schedule-filter.html'
})
export class ScheduleFilterPage {
  tracks: Array<{ name: string, isChecked: boolean }> = [];
  status: Array<{ name: string, isChecked: boolean }> = [];
  security: Array<{ name: string, isChecked: boolean }> = [];

  constructor(private confData: ConferenceData, private navParams: NavParams, private viewCtrl: ViewController) {
     // passed in array of tracks that should be excluded (unchecked)
    let filterCriteria = this.navParams.data;

    this.confData.getTracks().then((trackNames: string[]) => {
        this.fillToggles(trackNames, this.tracks, filterCriteria.excludedTracks);
    });

    this.fillToggles(["Public", "Private"], this.security, filterCriteria.excludedSecurity);
    this.fillToggles(["Open", "Closed"], this.status, filterCriteria.excludedStatus);
  }

  private fillToggles(dataArray: any[], toggleArray: Array<FilterToggle>, excludedItem: string[]) {
      // fill a new array to toggle preference
    dataArray.forEach(item => {
        let name = item;
        if (name.name) {name = name.name;};
        toggleArray.push({
        name: name,
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
