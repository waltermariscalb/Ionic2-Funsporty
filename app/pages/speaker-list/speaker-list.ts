import {NavController, Page, ActionSheet, Alert, Modal} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {SpeakerDetailPage} from '../speaker-detail/speaker-detail';
import {ProfileDetailPage} from '../profile-detail/profile-detail';
import {SportmenFilterPage} from '../sportmen-filter/sportmen-filter';

@Page({
  templateUrl: 'build/pages/speaker-list/speaker-list.html'
})
export class SpeakerListPage {
  actionSheet: ActionSheet;
  sportmen: Array<ISportman> =[];
  queryText: string = '';
  segment: string = 'all';
  excludedSports: Array<string>=[];
  excludedLevels: Array<string>=[];
  excludedAgeCategories: Array<string>=[];
  excludedGenders: Array<string>=[];

  counter:number = 0;


  constructor(private nav: NavController, private confData: ConferenceData, private user: UserData) {
     this.updateSportmen();
  }

  goToProfileDetail(profile, sportman) {
    let Fullprofile: any = {profile: profile, sportman: sportman}
    this.nav.push(ProfileDetailPage, Fullprofile);
  }

  goToSportmanDetail(sportmanName: string) {
    this.nav.push(SpeakerDetailPage, sportmanName);
  }

  goToSportmanTwitter(sportman: ISportman) {
    window.open(`https://twitter.com/${sportman.twitter}`);
  }

  openSportmanShare(sportman: ISportman) {
    let actionSheet: ActionSheet = ActionSheet.create({
      title: 'Share ' + sportman.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log("Copy link clicked on https://twitter.com/" + sportman.twitter);
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
                window['cordova'].plugins.clipboard.copy("https://twitter.com/" + sportman.twitter);
            }
          }
        },
        {
          text: 'Share via ...',
          handler: () => {
            console.log("Share via clicked");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
          }
        },
      ]
    });

    this.nav.present(actionSheet);
  }

  updateSportmen() {
    this.confData.getSportmen(this.queryText, this.excludedGenders, this.excludedLevels, this.excludedAgeCategories, this.excludedSports, this.segment).then(data => {
      this.counter = data.filter(c => !c.hide).length;
      data.forEach(c => {c["more"] = false; c["showdetail"] = false; });
      this.sportmen = data;
    });
  }

  presentFilter() {
    let FilterCriteria: Object = {excludedSports:this.excludedSports,excludedGenders:this.excludedGenders,excludedLevels:this.excludedLevels,excludedAgeCategories:this.excludedAgeCategories}
    let modal = Modal.create(SportmenFilterPage, FilterCriteria);
    this.nav.present(modal);

    modal.onDismiss(data => {
      if (data) {
        this.excludedSports = data.excludedSports;
        this.excludedGenders = data.excludedGenders;
        this.excludedLevels = data.excludedLevels;
        this.excludedAgeCategories = data.excludedAgeCategories;

        this.updateSportmen();
      }
    });

  }
  showDetail(sportman: ISportman) {
      sportman["showdetail"] = !sportman["showdetail"];
  }

  addFavorite(sportman: ISportman) {

    if (this.user.hasFavorite('sportmen',sportman.name)) {
      // woops, they already favorited it! What shall we do!?
      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite already added',
        message: 'Would you like to remove this from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // they clicked the cancel button, do not remove the session
              // close the sliding item and hide the option buttons

            }
          },
          {
            text: 'Remove',
            handler: () => {
              // they want to remove this session from their favorites
        this.user.removeFavorite('sportmen', sportman.name);


            }
          }
        ]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);

    } else {
      // remember this session as a user favorite
    this.user.addFavorite('sportmen', sportman.name);

      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item

          }
        }]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);
    }

  }
}
