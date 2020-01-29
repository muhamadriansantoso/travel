import {Component, OnInit} from '@angular/core';
import localeId from '@angular/common/locales/id';
import {registerLocaleData} from '@angular/common';
import {Client} from 'ngx-soap';


registerLocaleData(localeId, 'id');

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

    model: any;
    loading: boolean = false;
    searchClicked: boolean = false;

    message: string;
    client: Client;

  constructor() {
  }

    ngOnInit() {
    }

    searchClickedEvent(){
        this.searchClicked = true;
    }

    searchClickedEventOut(){
        this.searchClicked = false;
    }

}
