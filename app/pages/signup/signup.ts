import {Page, NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {UserData} from '../../providers/user-data';


@Page({
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage {
   submitted: boolean=false;
   signup :  { username?: string, password?: string } = {};
   constructor(private nav: NavController, private userData: UserData) {}

   onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup();
      this.nav.push(TabsPage);
    }
  }
}
