import {Page, NavParams, ViewController} from 'ionic-angular';
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
  genders: Array<FilterToggle> = [];
  levels: Array<FilterToggle> = [];
  ageCategories: Array<FilterToggle> = [];


  constructor(private confData: ConferenceData, private navParams: NavParams, private viewCtrl: ViewController) {
     // passes Object with array for each criteria that should be excluded (unchecked)
    let filterCriteria = this.navParams.data;

    this.confData.getSports().then((sports: any[]) => {
        this.fillToggles(sports, this.sports, filterCriteria.excludedSports);
        });
        
    this.confData.getGenders().then((genders: {name:string} []) => {
        this.fillToggles(genders, this.genders, filterCriteria.excludedGenders);
        });
        
    this.confData.getLevels().then((levels: {name:string} []) => {
        this.fillToggles(levels, this.levels, filterCriteria.excludedLevels);
        });
                         
    this.confData.getAgeCategories().then((ageCategories: {name:string} []) => {
        this.fillToggles(ageCategories, this.ageCategories, filterCriteria.excludedAgeCategories);
        });           
  }

  private fillToggles(dataArray: any[], toggleArray: Array<FilterToggle>,excludedItem:string[]) {
      //fill a new array to toggle preference
    dataArray.forEach(item => {
        let name = item.name;
        toggleArray.push({
        name: name,
        isChecked: (excludedItem.indexOf(name) === -1) //if it doesn't exist in the array is checked.
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

  applyFilters(toggleOn:boolean=false) {
    // Pass back a new array of names toggled on or off
    let data:any={};
    
    data.excludedSports = this.sports.filter(c => toggleOn ? c.isChecked:!c.isChecked).map(c => c.name);
    data.excludedGenders = this.genders.filter(c => toggleOn ? c.isChecked:!c.isChecked).map(c => c.name);
    data.excludedLevels = this.levels.filter(c => toggleOn ? c.isChecked:!c.isChecked).map(c => c.name);
    data.excludedAgeCategories = this.ageCategories.filter(c => toggleOn ? c.isChecked:!c.isChecked).map(c => c.name);
    
    this.dismiss(data);
  }

  dismiss(data) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
