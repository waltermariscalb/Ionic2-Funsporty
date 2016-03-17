import {NavController, Page, ActionSheet, Alert, Modal} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {TabsPage} from '../tabs/tabs';

import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Page({
        templateUrl: 'build/pages/profile-form/profile-form.html'
})

export class ProfileForm {
  	profileForm: ControlGroup;
	sportman: Object;
	submitted: boolean = false;

    constructor(private nav: NavController,private confData: ConferenceData, private user:UserData) {
		this.sportman = {img: '', status: 'active', gender: 'Male', email: 'test@test.cl', birthdate: new Date(1984, 12, 8), zones: [{ city: '', country: '' }], receivenotification: true, publiscalendar:false };
        user.getUserName().then(username => {this.sportman["name"] = username});
	}

Save(form) {
	this.submitted = true;
	 if (form.valid) {
         alert(JSON.stringify(this.sportman));
         this.user.signup(this.sportman['name'],'');

     }
 }



}