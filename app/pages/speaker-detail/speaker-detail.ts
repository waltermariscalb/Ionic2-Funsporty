import {NavController, NavParams, Page} from 'ionic-angular';
import {SessionDetailPage} from '../session-detail/session-detail';
import {ProfileDetailPage} from '../profile-detail/profile-detail';

@Page({
  templateUrl: 'build/pages/speaker-detail/speaker-detail.html'
})
export class SpeakerDetailPage {
	speaker: any;

	constructor(private nav: NavController, private navParams: NavParams) {
		this.speaker = this.navParams.data;
	}

	goToSessionDetail(session) {
		this.nav.push(SessionDetailPage, session);
	}

	goToProfileDetail(profile,sportman) {
		let Fullprofile:any = {profile:profile,sportman:sportman}
		this.nav.push(ProfileDetailPage, Fullprofile);
	}
	}