import {NavController, NavParams, Page} from "ionic-angular";
import {ConferenceData} from "../../providers/conference-data";
import {UserData} from "../../providers/user-data";

interface SportToggle extends ISport  {
    isChecked?: boolean;
}

@Page({
  templateUrl: "build/pages/sport-list/sport-list.html"
})

export class SportList {
    sportman: ISportman;
    sports: Array<SportToggle>;
    sportsToggle: Array<SportToggle>;
    selectedSportNames: Array<string>= [];
    filterType: string;

    searchQuery: string = "";

    constructor(private nav: NavController, private navParams: NavParams, private confData: ConferenceData, private user: UserData) {
        this.sportman = this.navParams.data;
        this.initializeItems();
    }

    initializeItems() {
        this.confData.getSports().then((sports: SportToggle[]) => {
            if (this.sportman.profiles) {
            sports.forEach(
                e => {e.isChecked = this.sportman.profiles.findIndex(
                    v => v.sportName === e.name) > -1 ; });
            }

            this.sports = sports;
            this.sportsToggle = sports;

        });
    }

    getItems(searchbar) {
        // Reset items back to all of the items
       // this.initializeItems();

        // set q to the value of the searchbar
        let q: string = searchbar.value;

        this.sportsToggle.forEach(r => {
            if (r.isChecked && this.selectedSportNames.indexOf(r.name) === -1) {
                this.selectedSportNames.push(r.name); }
            else if (!r.isChecked && this.selectedSportNames.indexOf(r.name) > -1) {
                this.selectedSportNames.splice(this.selectedSportNames.indexOf(r.name)); };
             });

        // if the value is an empty string don't filter the items
        if (q.trim() === "") {
            this.sportsToggle = this.sports;
        } else {
            this.sportsToggle = this.sports.filter(v => {
                if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {return true; }
                return false;
                });
        }

        this.sportsToggle.forEach(
             e => {e.isChecked = (this.selectedSportNames.indexOf(e.name) > -1); });

    }

}