import {Page} from 'ionic-framework/ionic';
import {SchedulePage} from '../schedule/schedule';
import {SpeakerListPage} from '../speaker-list/speaker-list';
import {MapPage} from '../map/map';
import {AboutPage} from '../about/about';
import {ProfileForm} from '../profile-form/profile-form';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
	 // set the root pages for each tab
    tab1Root = SpeakerListPage;
    tab2Root = SchedulePage;
    tab3Root = MapPage;
    tab4Root = ProfileForm;

  constructor() {
   
  }
}
