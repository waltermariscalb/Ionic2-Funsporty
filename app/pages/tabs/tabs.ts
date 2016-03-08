import {Page,NavParams} from 'ionic-angular';
import {SchedulePage} from '../schedule/schedule';
import {SpeakerListPage} from '../speaker-list/speaker-list';
import {MapPage} from '../map/map';
import {ProfileForm} from '../profile-form/profile-form';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html';
})
export class TabsPage {
	 // set the root pages for each tab
    tab1Root:any = SpeakerListPage;
    tab2Root:any = SchedulePage;
    tab3Root:any = MapPage;
    tab4Root:any = ProfileForm;
	mySelectedIndex: number;

  constructor(navParams: NavParams) {
   	this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
