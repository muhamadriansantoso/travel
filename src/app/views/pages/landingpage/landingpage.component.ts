import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import localeId from '@angular/common/locales/id';
import {registerLocaleData} from '@angular/common';
import {Client} from 'ngx-soap';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {APIService} from '../../../core/API';


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

  message: string;
  client: Client;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
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

}
