import {Page, NavParams, ViewController} from 'ionic-framework/ionic';
import {ConferenceData} from '../../providers/conference-data';


@Page({
  templateUrl: 'build/pages/schedule-filter/schedule-filter.html'
})
export class ScheduleFilterPage {
  tracks: Array<{ name: string, isChecked: boolean }> = [];

  constructor(private confData: ConferenceData, private navParams: NavParams, private viewCtrl: ViewController) {
     // passed in array of tracks that should be excluded (unchecked)
    let excludeTracks = this.navParams.data;

    this.confData.getTracks().then((trackNames: string[]) => {

      trackNames.forEach(trackName => {
        this.tracks.push({
          name: trackName,
          isChecked: (excludeTracks.indexOf(trackName) === -1)
        });
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
    let excludeTracks = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludeTracks);
  }

  dismiss(data) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
