import {Page, NavParams, ViewController} from 'ionic-framework/ionic';
import {ConferenceData} from '../../providers/conference-data';

interface FilterToggle {
  name: string; 
  isChecked: boolean
}


@Page({
  templateUrl: 'build/pages/sportmen-filter/sportmen-filter.html'
})
export class SportmenFilterPage {
  sports: Array<FilterToggle> = [];
  gender: Array<FilterToggle> = [];
  level: Array<FilterToggle> = [];
  ageLevel: Array<FilterToggle> = [];


  constructor(private confData: ConferenceData, private navParams: NavParams, private viewCtrl: ViewController) {
     // passed in array of tracks that should be excluded (unchecked)
    let selectedSports = this.navParams.data;

    this.confData.getSports().then((sports: any[]) => {
        this.fillToggles(sports, this.sports, selectedSports);
        });
  }

  private fillToggles(dataArray: any[], toggleArray: Array<FilterToggle>,selectedItem:string[]) {
      //fill a new array to toggle preference
    dataArray.forEach(item => {
        toggleArray.push({
        name: item.name,
        isChecked: (selectedItem.indexOf(item.name) > -1)
      });
      });
  }

  selectAll() {
    // reset all of the toggles to be checked
    this.sports.forEach(sport => {
      sport.isChecked = true;
    });
  }

  deselectAll() {
    // reset all of the toggles to be checked
    this.sports.forEach(sport => {
      sport.isChecked = false;
    });
  }

  applyFilters(toggleOn:boolean=true) {
    // Pass back a new array of names toggled on or off
    let data = this.sports.filter(c => toggleOn? c.isChecked:!c.isChecked).map(c => c.name);
    this.dismiss(data);
  }

  dismiss(data) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
