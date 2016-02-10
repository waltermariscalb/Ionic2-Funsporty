import {App, IonicApp, Events} from 'ionic-framework/ionic';
import {ConferenceData} from './providers/conference-data';
import {UserData} from './providers/user-data';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';
import {AboutPage} from './pages/about/about';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


interface PageObj {
  name: string;
  title: string;
  component: Type;
  icon: string;
  hide: boolean;
}

@App({
  templateUrl: 'build/app.html',
  providers: [ConferenceData, UserData],
  config: {}
})
class ConferenceApp {
  rootPage: Type = TabsPage; //TutorialPage;
  pages: PageObj[];

  constructor(private app: IonicApp, private events: Events, confData: ConferenceData, private userData: UserData) {
    // load the conference data
    confData.load();

    // We plan to add auth to only show the login page if not logged in
    
    // create an list of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    this.pages = [
      { title: 'HOME',name:'Schedules',component: TabsPage, icon: 'home', hide: false },
      { title: 'Ranking', name: 'Ranking', component: TabsPage, icon: 'podium', hide: false },
      { title: 'Establecimientos', name: 'Centers', component: TabsPage, icon: 'home', hide: false },     
      { title: 'Iniciar', name:'Login', component: LoginPage, icon: 'log-in', hide: true },
      { title: 'Registrarse', name:'Signup', component: SignupPage, icon: 'person-add', hide: true },
      { title: 'Cerrar sesión', name: 'Logout', component: LoginPage, icon: 'log-out', hide: true },
      { title: 'Acerca de', name:'About', component: AboutPage, icon: 'information-circle', hide: false },
    ];

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      console.log(hasLoggedIn);
      this.updateSideMenuItems(hasLoggedIn)
    });

    this.listenToLoginEvents();
  }

  openPage(page: PageObj) {
    if (page.name === 'Logout') {
      this.userData.logout();
    }

    // find the nav component and set what the root page should be
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    
    nav.setRoot(page.component);

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
      this.updateSideMenuItems(true);
    });

    this.events.subscribe('user:signup', () => {
      this.updateSideMenuItems(true);
    });

    this.events.subscribe('user:logout', () => {
      this.updateSideMenuItems(false);
    });
  }

  updateSideMenuItems(hasLoggedIn: boolean) {
    if (hasLoggedIn) {
      this.findMenuItemByName('Login').hide = true;
      this.findMenuItemByName('Signup').hide = true;
      this.findMenuItemByName('Logout').hide = false;
    } else {
      this.findMenuItemByName('Login').hide = false;
      this.findMenuItemByName('Signup').hide = false;
      this.findMenuItemByName('Logout').hide = true;
    }
  }

  findMenuItemByName(name: string) {
    return this.pages.find((menuItem) => {
      return menuItem.name === name
    })
  }
}
