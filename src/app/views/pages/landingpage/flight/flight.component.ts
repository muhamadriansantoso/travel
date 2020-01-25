import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIService} from '../../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

  searchFlightForm: FormGroup;
  airportList: any;
  fromCity: string;
  formCityValue: string;
  toCity: string;
  toCityValue: string;
  adultPassenger: number;
  childPassenger: number;
  infantPassenger: number;
  roundType: string;
  public passengersCollapsed: boolean = false;

  constructor(
    private http: HttpClient,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.adultPassenger = 1;
    this.childPassenger = 0;
    this.infantPassenger = 0;
    this.roundType = 'oneway';

    this.api.airportList().subscribe((data: any) => {
      this.airportList = data;
      this.cdr.detectChanges();
    });

    this.initSearchFlightForm();
  }

  initSearchFlightForm() {
    this.searchFlightForm = this.fb.group({
      origin: ['', Validators.compose([
        Validators.required,
      ])
      ],
      destination: ['', Validators.compose([
        Validators.required,
      ])
      ],
      cabin: ['Economy', Validators.compose([
        Validators.required,
      ])
      ],
      adult: ['1', Validators.compose([
        Validators.required,
      ])
      ],
      child: ['0'],
      infant: ['0'],
      departure: ['', Validators.compose([
        Validators.required,
      ])
      ],
      return: ['']
    });
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `
<div style="margin-bottom: 4px;">
<span style="font-size: 14px; line-height: 20px; font-weight: 500" class="">${data.city}, ${data.country}</span>
</div>
<div>
<span style="color: #8f8f8f; font-size: 12px; line-height: 16px; white-space: normal; font-weight: 400">${data.iata} - ${data.name}</span>
</div>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  cityAutoComplete(data, formorto) {
    if (formorto == 'from') {
      this.fromCity = data.city + ', ' + data.iata;
      this.formCityValue = data.iata;
    } else if (formorto == 'to') {
      this.toCity = data.city + ', ' + data.iata;
      this.toCityValue = data.iata;
    }
  }


  showPassengerIn() {
    this.passengersCollapsed = !this.passengersCollapsed;
  }

  showPassengerOut(e: Event) {
    this.passengersCollapsed = false;
  }

  typeRound(value) {
    this.roundType = value;
  }

  adultPassengerMinus() {
    if (this.adultPassenger > 1) {
      this.adultPassenger = this.adultPassenger - 1;
    } else {
      return false;
    }
  }

  adultPassengerPlus() {
    this.adultPassenger = this.adultPassenger + 1;
  }

  childPassengerMinus() {
    if (this.childPassenger > 0) {
      this.childPassenger = this.childPassenger - 1;
    } else {
      return false;
    }
  }

  childPassengerPlus() {
    this.childPassenger = this.childPassenger + 1;
  }

  infantPassengerMinus() {
    if (this.infantPassenger > 0) {
      this.infantPassenger = this.infantPassenger - 1;
    } else {
      return false;
    }
  }

  infantPassengerPlus() {
    this.infantPassenger = this.infantPassenger + 1;
  }

  searchFlight() {
  }
}
