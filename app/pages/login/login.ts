import {IonicApp, Page, NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {UserData} from '../../providers/user-data';


@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted= false;

  constructor(public nav: NavController, public userData: UserData) {}

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login();
      this.nav.push(TabsPage);
    }
  }

  onSignup() {
    this.nav.push(SignupPage);
  }
}
