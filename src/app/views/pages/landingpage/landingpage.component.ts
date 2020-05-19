import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import localeId from '@angular/common/locales/id';
import {registerLocaleData} from '@angular/common';
import {Client} from 'ngx-soap';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {APIService} from '../../../core/API';
import {Router} from '@angular/router';


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
  isCollapsed: boolean;
  slider: any;
  currentRoute: string;
  flightClicked: boolean;
  hotelClicked: boolean;
  eSIMsClicked: boolean;
  fixmarketClicked: boolean;

  message: string;
  client: Client;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    if (this.router.url == '/flight') {
      this.flightClicked = true;
      this.hotelClicked = false;
      this.eSIMsClicked = false;
      this.fixmarketClicked = false;
    } else if (this.router.url == '/hotel') {
      this.flightClicked = false;
      this.eSIMsClicked = false;
      this.fixmarketClicked = false;
      this.hotelClicked = true;
    } else if (this.router.url == '/eSIMs') {
      this.flightClicked = false;
      this.hotelClicked = false;
      this.fixmarketClicked = false;
      this.eSIMsClicked = true;
    } else if (this.router.url == '/fixmarket' || this.router.url == '/') {
      this.flightClicked = false;
      this.hotelClicked = false;
      this.eSIMsClicked = false;
      this.fixmarketClicked = true;
    }

    this.isCollapsed = true;
    this.api.getSlider().subscribe((data: any) => {
      this.slider = data;
      this.cdr.detectChanges();
    });
  }

  searchClickedEvent() {
    this.searchClicked = true;
  }

  searchClickedEventOut() {
    this.searchClicked = false;
  }

  activeClass(value) {
    this.currentRoute = this.router.url;
    if (value == 'flight') {
      this.flightClicked = true;
      this.hotelClicked = false;
      this.eSIMsClicked = false;
      this.fixmarketClicked = false;
    } else if (value == 'hotel') {
      this.flightClicked = false;
      this.eSIMsClicked = false;
      this.fixmarketClicked = false;
      this.hotelClicked = true;
    } else if (value == 'eSIMs') {
      this.flightClicked = false;
      this.hotelClicked = false;
      this.fixmarketClicked = false;
      this.eSIMsClicked = true;
    } else if (value == 'fixmarket') {
      this.flightClicked = false;
      this.hotelClicked = false;
      this.eSIMsClicked = false;
      this.fixmarketClicked = true;
    }
  }

}
