import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIService} from '../../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import * as moment from 'moment';

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
  departureDate: string;
  minDate: any;

  searchFlightFormInvalid: boolean;

  public passengersCollapsed: boolean = false;

  constructor(
    private http: HttpClient,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.adultPassenger = 1;
    this.childPassenger = 0;
    this.infantPassenger = 0;
    this.roundType = 'oneway';

    var today = new Date();
    this.minDate = {
      'year': today.getFullYear(),
      'month': parseInt(moment(today).format('MM'), 0),
      'day': parseInt(moment(today).format('DD'), 0)
    };

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
    const dataType = typeof data;
    if (dataType == 'object') {
      if (formorto == 'from') {
        this.fromCity = data.city + ', ' + data.iata;
        this.formCityValue = data.iata;
      } else if (formorto == 'to') {
        this.toCity = data.city + ', ' + data.iata;
        this.toCityValue = data.iata;
      }
    } else {
      if (formorto == 'from') {
        this.fromCity = '';
        this.formCityValue = '';
      } else if (formorto == 'to') {
        this.toCity = '';
        this.toCityValue = '';
      }
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
    const controls = this.searchFlightForm.controls;
    if (this.searchFlightForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.searchFlightFormInvalid = true;
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      return;
    }

    const authData = {
      cabin: controls['cabin'].value,
      adult: controls['adult'].value,
      child: controls['child'].value,
      infant: controls['infant'].value,
      departure: controls['departure'].value,
    };

    this.departureDate = moment(authData.departure.year + '-' + authData.departure.month + '-' + authData.departure.day).format('YYYY-MM-DD');

    this.router.navigate(['/search-flight'], {
      queryParams:
        {
          d: this.formCityValue,
          a: this.toCityValue,
          date: this.departureDate,
          r_date: '',
          adult: authData.adult,
          child: authData.child,
          infant: authData.infant,
          cabin: authData.cabin,
          type: 'one-way'
        },
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.searchFlightForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  searchFlightFormFailurePopUPHide() {
    this.searchFlightFormInvalid = false;
  }
}
