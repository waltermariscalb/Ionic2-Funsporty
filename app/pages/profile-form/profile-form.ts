import {NavController, Page, ActionSheet, Alert, Modal} from "ionic-angular";
import {ConferenceData} from "../../providers/conference-data";
import {UserData} from "../../providers/user-data";
import {TabsPage} from "../tabs/tabs";

import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from "angular2/common";

@Page({
        templateUrl: "build/pages/profile-form/profile-form.html"
})

export class ProfileForm {
    profileForm: ControlGroup;
    sportman: ISportman;
    submitted: boolean = false;

    constructor(private nav: NavController, private confData: ConferenceData, private user: UserData) {
        this.sportman = {
            name: "Anonimous",
            gender: "Male",
            agecategory : "",
            status: "active",
            email: "test@test.cl",
            birthdate: new Date(1984, 12, 8),
            reputation: 0,
            receivenotification: true,
            publiscalendar: false,
            zones: [{sector: "", loc: "", city: "", country: "", lat: 0, lng: 0 }],
            calendar: [{name: "Available",
                weekdays: [
                {status: "Active", "from": "19:00", "to": "21:00"},
                {status: "Active", "from": "19:00", "to": "21:00"},
                {status: "Active", "from": "19:00", "to": "21:00"},
                {status: "Active", "from": "19:00", "to": "21:00"},
                {status: "Active", "from": "19:00", "to": "21:00"},
                {status: "Active", "from": "09:00", "to": "12:00"},
                {status: "Active", "from": "09:00", "to": "13:00"},
                ]
            }],
            profilePic: "",
            twitter: "",
            about: "",
            location: ""};

        user.getUserName().then(username => {this.sportman["name"] = username; });
    }

Save(form) {
    this.submitted = true;
        if (form.valid) {
            alert(JSON.stringify(this.sportman));
            this.user.signup(this.sportman["name"], "");
        }
    }

}