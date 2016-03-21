import {NavController, NavParams, Page} from "ionic-angular";
import {ConferenceData} from "../../providers/conference-data";
import {UserData} from "../../providers/user-data";

interface SportToggle extends ISport  {
    isChecked?: boolean;
    hide?: boolean;
}

@Page({
  templateUrl: "build/pages/sport-list/sport-list.html"
})

export class SportList {
    sportman: ISportman;
    sports: Array<SportToggle>;
    filterType: string= "All";
    searchQuery: string = "";

    constructor(private nav: NavController, private navParams: NavParams, private confData: ConferenceData, private user: UserData) {
        this.sportman = this.navParams.data;
        this.initializeItems();
    }

    initializeItems() {
        this.confData.getSports().then((sports: SportToggle[]) => {
            if (this.sportman.profiles) {
            sports.forEach(
                e => {e.isChecked = this.sportman.profiles.findIndex( // check if the sport is in profile
                    v => v.sportName === e.name) > -1 ; e.hide = false; });
            }
            this.sports = sports.slice();
        });

    }

    selectedSports(): Array<SportToggle> {
        return this.sports.filter(v => v.isChecked === true);
    }

    isHidden(sport: any, searchCriteria: string): boolean {
            return  !(sport.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) > -1) ;
    }

    updateList() {
        // Reset items back to all of the items
        // this.initializeItems();

        // set q to the value of the searchbar
        let q: string = this.searchQuery;

        // if the value is an empty string don't filter the items
        switch (this.filterType) {
            case "All":
                if (!(q.trim() === "")) {
                    this.sports.forEach((v: SportToggle) => {
                        v.hide = this.isHidden(v, q);
                        });
                } else {
                    this.sports.forEach((v: SportToggle) => {
                    v.hide = false;
                    });
                }
                break;
            case "Mine":
                this.sports.forEach((v: SportToggle) => {
                v.hide = !v.isChecked; });
                break;
            }
        };
 }
