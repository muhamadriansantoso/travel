import {Component, OnInit} from '@angular/core';
import localeId from '@angular/common/locales/id';
import {registerLocaleData} from '@angular/common';
import {Client} from 'ngx-soap';
import {OwlOptions} from 'ngx-owl-carousel-o';


registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  customOptions: OwlOptions = {
    items: 1,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    loop: true,
    navSpeed: 100,
    autoplay: true
  };

  model: any;
  loading: boolean = false;
  searchClicked: boolean = false;

  message: string;
  client: Client;

  constructor() {
  }

  ngOnInit() {
  }

  searchClickedEvent() {
    this.searchClicked = true;
  }

  searchClickedEventOut() {
    this.searchClicked = false;
  }

}
