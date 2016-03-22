import {Page, InfiniteScroll} from "ionic-angular";
import {Injectable} from "angular2/core";

@Page({
  templateUrl: "build/pages/event-list/event-list.html",
  directives: [InfiniteScroll],
  providers: [InfiniteScroll]
})

@Injectable()
export class EventList {
  constructor(private items) {
    this.items = [];
    for (let i = 0; i < 30; i++) {
      this.items.push( this.items.length );
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.items.push( this.items.length );
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
}
