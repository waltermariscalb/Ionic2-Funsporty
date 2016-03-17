import {Page, NavParams} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/profile-detail/profile-detail.html'
})
export class ProfileDetailPage {
	profile: any;
    name: string;
    profilePic: any;

  constructor(private navParams: NavParams) {
    this.profile = navParams.data.profile;
    this.name = navParams.data.sportman.name;
    this.profilePic = navParams.data.sportman.profilePic;
  }
}
