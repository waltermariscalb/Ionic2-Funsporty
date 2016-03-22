import {App, IonicApp, Events, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ConferenceData} from './providers/conference-data';
import {UserData} from './providers/user-data';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';
import {AboutPage} from './pages/about/about';
import {CenterList} from './pages/center-list/center-list';
import {RankingList} from './pages/ranking-list/ranking-list';
import {EventList} from './pages/event-list/event-list';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


interface PageObj {
  name: string;
  title: string;
  component: Type;
  icon: string;
  index?: number;
}

@App({
  templateUrl: 'build/app.html',
  providers: [ConferenceData, UserData],
  config: {
     platforms: {
       android: {
         tabbarLayout: 'icon-hide'
       }
     }
   }
})
class ConferenceApp {
  rootPage: Type = TabsPage; // TutorialPage;
  loggedIn = false;

  appPages: PageObj[];
  loggedInPages: PageObj[];
  loggedOutPages: PageObj[]


  constructor(private app: IonicApp, private events: Events, confData: ConferenceData, private userData: UserData, platform: Platform ) {
    // load the conference data
    confData.load();

    // We plan to add auth to only show the login page if not logged in

    // create an list of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    this.appPages = [
      { title: 'HOME',name:'Schedules', component: TabsPage, icon: 'home' },
      { title: 'Ranking', name: 'Ranking', component: RankingList, index: 1, icon: 'podium' },
      { title: 'Establecimientos', name: 'Centers', component: CenterList, index: 2, icon: 'home'},
      { title: 'Eventos', name: 'Events', component: EventList, index: 3, icon: 'notifications'},
      { title: 'Acerca de', name:'About', component: AboutPage, index: 4, icon: 'information-circle' }
    ];

    this.loggedInPages = [{ title: 'Cerrar sesión', name: 'Logout', component: LoginPage, icon: 'log-out' }];

    this.loggedOutPages = [{ title: 'Iniciar', name:'Login', component: LoginPage, icon: 'log-in' },
      { title: 'Registrarse', name:'Signup', component: SignupPage, icon: 'person-add'}];

    platform.ready().then(() => {
         StatusBar.styleDefault();
        });

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      console.log(hasLoggedIn);
      this.loggedIn = (hasLoggedIn == 'true');
      //this.updateSideMenuItems(hasLoggedIn)
    });

    this.listenToLoginEvents();
  }

  openPage(page: PageObj) {


    // find the nav component and set what the root page should be
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');


    if (page.index) {
      nav.setRoot(page.component, {tabIndex: page.index});
    } else {
      nav.setRoot(page.component);
    }

    if (page.name === 'Logout') {
      setTimeout(() => {
              this.userData.logout();
            }, 1000);
    }
/*
    nav.setRoot(page.component).then(() => { //verify this part
      // wait for the root page to be completely loaded
      // then close the menu
      this.app.getComponent('leftMenu').close();
    });
*/
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
     this.loggedIn = true;
    });

    this.events.subscribe('user:signup', () => {
     this.loggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
     this.loggedIn = false;
    });
  }

}
