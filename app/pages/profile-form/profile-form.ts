import {NavController, Page, ActionSheet, Alert, Modal} from 'ionic-framework/ionic';
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

    constructor(private nav: NavController,private confData: ConferenceData) {
		this.sportman = { username: undefined, user_id: -1, img: '', status: 'active', gender: 'Male', email: '', birthdate: undefined, zones: [{ city: '', country: '' }], receivenotification: true, publiscalendar:true };
        
	}

Save(form) {
	this.submitted = true;
	 if (form.valid) {
		 alert(JSON.stringify(this.sportman));
		 this.nav.push(TabsPage);
     }
 } 



}