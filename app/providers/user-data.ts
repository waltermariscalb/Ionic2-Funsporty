import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';


@Injectable()
export class UserData {
  _sessionsFavorites = [];
  _sportmenFavorites = [];

  HAS_LOGGED_IN = 'hasLoggedIn';
  storage = new Storage(LocalStorage);

  constructor(public events: Events) {console.log("user data config");}

  public hasFavorite(topicName,Name) {
    if (topicName == 'sportmen') {
      return (this._sportmenFavorites.indexOf(Name) > -1);
    }
    else {
      return (this._sessionsFavorites.indexOf(Name) > -1);
    }
  }

  public addFavorite(topicName, Name) {
    if (topicName == 'sportmen') {
      this._sportmenFavorites.push(Name);
    } else{
      this._sessionsFavorites.push(Name);
    }
  }

  public removeFavorite(topicName, Name) {
    if (topicName === "sportmen") {
      let index = this._sportmenFavorites.indexOf(Name)
      if (index > -1) {
        this._sportmenFavorites.splice(index, 1);
      }
    } else {
      let index = this._sessionsFavorites.indexOf(Name)
      if (index > -1) {
        this._sessionsFavorites.splice(index, 1);
      }
    }
  }

  public login(user?: ISportman, password?) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set("username", user.name);
    this.events.publish("user:login");
  }

  public signup(user?: ISportman, password?) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set("username", user.name);
    this.events.publish("user:signup");
  }

  public logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.events.publish("user:logout");
  }

  // return a promise
  public hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }

  public getUserName() {
      return this.storage.get("username").then((value) => {
    return value ? value : "Brandy Carney";
    });
  }
}
