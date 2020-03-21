import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIService} from '../../../../core/API';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {
  searchFlightForm: FormGroup;
  airportList: any;
  fromCity: string;
  fromCityArray: any = [];
  formCityValue: string;
  formCityValueArray: any = [];
  toCity: string;
  toCityArray: any = [];
  toCityValue: string;
  toCityValueArray: any = [];
  adultPassenger: number;
  childPassenger: number;
  infantPassenger: number;
  roundType: string;
  departureDate: string;
  returnDate: string;
  cabin: string;
  minDate: any;
  minDateReturn: any;
  minDateArray: any = [];
  defaultDepatureDate: any;
  defaultDepatureDateArray: any = [];
  defaultReturnDate: any;
  multipleTripLength: number;
  reverseClicked: boolean;
  reverseClickedArray: any = [];

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

  get multipleTrip() {
    return this.searchFlightForm.get('multipleTrip') as FormArray;
  }

  ngOnInit() {
    this.adultPassenger = 1;
    this.childPassenger = 0;
    this.infantPassenger = 0;
    this.roundType = 'one-way';
    this.returnDate = '';
    this.cabin = 'Economy';
    this.multipleTripLength = 1;

    var today = new Date();
    var todayPlusOne = moment(today).add(1, 'days').toDate();
    var todayPlusTwo = moment(today).add(2, 'days').toDate();
    var todayPlusFour = moment(today).add(4, 'days').toDate();

    this.defaultDepatureDate = {
      'year': todayPlusOne.getFullYear(),
      'month': parseInt(moment(todayPlusOne).format('MM'), 0),
      'day': parseInt(moment(todayPlusOne).format('DD'), 0)
    };

    var defaultDepatureDateFormatted = moment(this.defaultDepatureDate.year + '-' + this.defaultDepatureDate.month + '-' + this.defaultDepatureDate.day).format('YYYY-MM-DD');
    var defaultDepatureDateFormattedToDate = moment(defaultDepatureDateFormatted).add(0, 'days').toDate();

    this.defaultDepatureDateArray[0] = {
      'year': todayPlusOne.getFullYear(),
      'month': parseInt(moment(todayPlusOne).format('MM'), 0),
      'day': parseInt(moment(todayPlusOne).format('DD'), 0)
    };

    this.defaultDepatureDateArray[1] = {
      'year': todayPlusTwo.getFullYear(),
      'month': parseInt(moment(todayPlusTwo).format('MM'), 0),
      'day': parseInt(moment(todayPlusTwo).format('DD'), 0)
    };

    this.minDateArray[0] = {
      'year': today.getFullYear(),
      'month': parseInt(moment(today).format('MM'), 0),
      'day': parseInt(moment(today).format('DD'), 0)
    };

    this.minDateArray[1] = {
      'year': todayPlusOne.getFullYear(),
      'month': parseInt(moment(todayPlusOne).format('MM'), 0),
      'day': parseInt(moment(todayPlusOne).format('DD'), 0)
    };

    this.defaultReturnDate = {
      'year': todayPlusFour.getFullYear(),
      'month': parseInt(moment(todayPlusFour).format('MM'), 0),
      'day': parseInt(moment(todayPlusFour).format('DD'), 0)
    };

    this.minDate = {
      'year': today.getFullYear(),
      'month': parseInt(moment(today).format('MM'), 0),
      'day': parseInt(moment(today).format('DD'), 0)
    };

    this.minDateReturn = {
      'year': defaultDepatureDateFormattedToDate.getFullYear(),
      'month': parseInt(moment(defaultDepatureDateFormattedToDate).format('MM'), 0),
      'day': parseInt(moment(defaultDepatureDateFormattedToDate).format('DD'), 0)
    };

    this.api.airportList().subscribe((data: any) => {
      this.airportList = data;
      this.cdr.detectChanges();
    });

    this.initSearchFlightForm();
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

  changeOriginDateDate() {
    var defaultCheckInDateFormatted = moment(this.defaultDepatureDate.year + '-' + this.defaultDepatureDate.month + '-' + this.defaultDepatureDate.day).format('YYYY-MM-DD');
    var defaultCheckInDateFormattedPlusFour = moment(defaultCheckInDateFormatted).add(4, 'days').toDate();
    var defaultCheckInDateFormattedPlusZero = moment(defaultCheckInDateFormatted).add(0, 'days').toDate();
    this.defaultReturnDate = {
      'year': defaultCheckInDateFormattedPlusFour.getFullYear(),
      'month': parseInt(moment(defaultCheckInDateFormattedPlusFour).format('MM'), 0),
      'day': parseInt(moment(defaultCheckInDateFormattedPlusFour).format('DD'), 0)
    };

    this.minDateReturn = {
      'year': defaultCheckInDateFormattedPlusZero.getFullYear(),
      'month': parseInt(moment(defaultCheckInDateFormattedPlusZero).format('MM'), 0),
      'day': parseInt(moment(defaultCheckInDateFormattedPlusZero).format('DD'), 0)
    };
  }

  changeOriginDateDateMulti(index) {
    for (var startFormArray = 0; startFormArray < this.multipleTrip.controls.length; startFormArray++) {
      if (index == startFormArray) {
        var defaultCheckInDateFormatted = [];
        defaultCheckInDateFormatted[index] = moment(this.defaultDepatureDateArray[index].year + '-' + this.defaultDepatureDateArray[index].month + '-' + this.defaultDepatureDateArray[index].day).format('YYYY-MM-DD');
        var defaultCheckInDateFormattedPlusOne = [];
        defaultCheckInDateFormattedPlusOne[index] = moment(defaultCheckInDateFormatted[index]).add(1, 'days').toDate();
        var defaultCheckInDateFormattedPlusZero = [];
        defaultCheckInDateFormattedPlusZero[index] = moment(defaultCheckInDateFormatted[index]).add(0, 'days').toDate();

        this.minDateArray[index + 1] = {
          'year': defaultCheckInDateFormattedPlusZero[index].getFullYear(),
          'month': parseInt(moment(defaultCheckInDateFormattedPlusZero[index]).format('MM'), 0),
          'day': parseInt(moment(defaultCheckInDateFormattedPlusZero[index]).format('DD'), 0)
        };

        this.defaultDepatureDateArray[index + 1] = {
          'year': defaultCheckInDateFormattedPlusOne[index].getFullYear(),
          'month': parseInt(moment(defaultCheckInDateFormattedPlusOne[index]).format('MM'), 0),
          'day': parseInt(moment(defaultCheckInDateFormattedPlusOne[index]).format('DD'), 0)
        };
      }
    }
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
      departure: [this.defaultDepatureDate, Validators.compose([
        Validators.required,
      ])
      ],
      return: [this.defaultReturnDate],
      multipleTrip: this.fb.array(
        [
          this.fb.group({
              originArray: '',
              destinationArray: '',
              departureArray: '',
            }
          ),
          this.fb.group({
              originArray: '',
              destinationArray: '',
              departureArray: '',
            }
          )
        ]
      ),
    });
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
    if (this.adultPassenger < 9) {
      this.adultPassenger = this.adultPassenger + 1;
    } else {
      return false;
    }
  }

  childPassengerMinus() {
    if (this.childPassenger > 0) {
      this.childPassenger = this.childPassenger - 1;
    } else {
      return false;
    }
  }

  childPassengerPlus() {
    if (this.childPassenger < 9) {
      this.childPassenger = this.childPassenger + 1;
    } else {
      return false;
    }
  }

  infantPassengerMinus() {
    if (this.infantPassenger > 0) {
      this.infantPassenger = this.infantPassenger - 1;
    } else {
      return false;
    }
  }

  infantPassengerPlus() {
    if (this.infantPassenger < 9) {
      this.infantPassenger = this.infantPassenger + 1;
    } else {
      return false;
    }
  }

  reverseDestination(from, to, formValue, toValue) {
    this.reverseClicked = !this.reverseClicked;
    this.fromCity = to;
    this.toCity = from;
    this.formCityValue = toValue;
    this.toCityValue = formValue;
  }

  reverseDestinationMulti(index, from, to, formValue, toValue) {

    if (this.reverseClickedArray[index]) {
      this.reverseClickedArray[index] = true;
    } else {
      this.reverseClickedArray[index] = false;
    }

    for (var startFormArray = 0; startFormArray < this.multipleTrip.controls.length; startFormArray++) {
      if (index == startFormArray) {
        this.reverseClickedArray[index] = !this.reverseClickedArray[index];
        this.fromCityArray[index] = to;
        this.toCityArray[index] = from;
        this.formCityValueArray[index] = toValue;
        this.toCityValueArray[index] = formValue;
      }
    }
  }

  searchFlight() {
    if (this.roundType == 'one-way' || this.roundType == 'round-trip') {
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
        return: controls['return'].value,
      };

      this.departureDate = moment(authData.departure.year + '-' + authData.departure.month + '-' + authData.departure.day).format('YYYY-MM-DD');

      if (this.roundType == 'one-way') {
        this.returnDate = '';
      } else {
        this.returnDate = moment(authData.return.year + '-' + authData.return.month + '-' + authData.return.day).format('YYYY-MM-DD');
      }

      this.router.navigate(['/search-flight'], {
        queryParams:
          {
            d: this.formCityValue,
            a: this.toCityValue,
            date: this.departureDate,
            r_date: this.returnDate,
            adult: authData.adult,
            child: authData.child,
            infant: authData.infant,
            cabin: authData.cabin,
            type: this.roundType
          },
      });
    } else if (this.roundType == 'multiple-trip') {
      const controls = this.searchFlightForm.controls;

      if (this.multipleTrip.invalid) {
        for (var startFormArray = 0; startFormArray < this.multipleTrip.controls.length; startFormArray++) {
          Object.keys(this.multipleTrip.controls[startFormArray.toString()].controls).forEach(controlName =>
            this.multipleTrip.controls[startFormArray.toString()].controls[controlName].markAsTouched()
          );
        }

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
        return: controls['return'].value,
      };

      for (var dateArrayStart = 0; dateArrayStart < this.defaultDepatureDateArray.length; dateArrayStart++) {
        this.defaultDepatureDateArray[dateArrayStart] = moment(this.defaultDepatureDateArray[dateArrayStart].year + '-' + this.defaultDepatureDateArray[dateArrayStart].month + '-' + this.defaultDepatureDateArray[dateArrayStart].day).format('YYYY-MM-DD');
      }

      this.returnDate = '';

      this.router.navigate(['/search-flight'], {
        queryParams:
          {
            d: this.formCityValueArray.filter(item => item),
            a: this.toCityValueArray.filter(item => item),
            date: this.defaultDepatureDateArray,
            r_date: this.returnDate,
            adult: authData.adult,
            child: authData.child,
            infant: authData.infant,
            cabin: authData.cabin,
            type: this.roundType
          },
      });
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.searchFlightForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  isControlHasErrorArray(controlName: string, validationType: string, index: string): boolean {
    const control = this.multipleTrip.controls[index].controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  searchFlightFormFailurePopUPHide() {
    this.searchFlightFormInvalid = false;
  }

  beforeChange($event: NgbTabChangeEvent) {
    this.roundType = $event.nextId;
    if (this.roundType == 'round-trip') {
      this.searchFlightForm.get('origin').setValidators(Validators.required);
      this.searchFlightForm.get('origin').updateValueAndValidity();
      this.searchFlightForm.get('destination').setValidators(Validators.required);
      this.searchFlightForm.get('destination').updateValueAndValidity();
      this.searchFlightForm.get('departure').setValidators(Validators.required);
      this.searchFlightForm.get('departure').updateValueAndValidity();
      this.searchFlightForm.get('return').setValidators(Validators.required);
      this.searchFlightForm.get('return').updateValueAndValidity();

      for (var startFormArray = 0; startFormArray < this.multipleTrip.controls.length; startFormArray++) {
        this.multipleTrip.controls[startFormArray].get('originArray').setValidators([]);
        this.multipleTrip.controls[startFormArray].get('originArray').updateValueAndValidity();
        this.multipleTrip.controls[startFormArray].get('destinationArray').setValidators([]);
        this.multipleTrip.controls[startFormArray].get('destinationArray').updateValueAndValidity();
        this.multipleTrip.controls[startFormArray].get('departureArray').setValidators([]);
        this.multipleTrip.controls[startFormArray].get('departureArray').updateValueAndValidity();
      }

    } else if (this.roundType == 'one-way') {
      this.searchFlightForm.get('origin').setValidators(Validators.required);
      this.searchFlightForm.get('origin').updateValueAndValidity();
      this.searchFlightForm.get('destination').setValidators(Validators.required);
      this.searchFlightForm.get('destination').updateValueAndValidity();
      this.searchFlightForm.get('departure').setValidators(Validators.required);
      this.searchFlightForm.get('departure').updateValueAndValidity();
      this.searchFlightForm.get('return').setValidators([]);
      this.searchFlightForm.get('return').updateValueAndValidity();

      for (var startFormArray = 0; startFormArray < this.multipleTrip.controls.length; startFormArray++) {
        this.multipleTrip.controls[startFormArray].get('originArray').setValidators([]);
        this.multipleTrip.controls[startFormArray].get('originArray').updateValueAndValidity();
        this.multipleTrip.controls[startFormArray].get('destinationArray').setValidators([]);
        this.multipleTrip.controls[startFormArray].get('destinationArray').updateValueAndValidity();
        this.multipleTrip.controls[startFormArray].get('departureArray').setValidators([]);
        this.multipleTrip.controls[startFormArray].get('departureArray').updateValueAndValidity();
      }

      this.returnDate = '';
    } else if (this.roundType == 'multiple-trip') {
      this.searchFlightForm.get('origin').setValidators([]);
      this.searchFlightForm.get('origin').updateValueAndValidity();
      this.searchFlightForm.get('destination').setValidators([]);
      this.searchFlightForm.get('destination').updateValueAndValidity();
      this.searchFlightForm.get('return').setValidators([]);
      this.searchFlightForm.get('return').updateValueAndValidity();

      for (var startFormArray = 0; startFormArray < this.multipleTrip.controls.length; startFormArray++) {
        this.multipleTrip.controls[startFormArray].get('originArray').setValidators(Validators.required);
        this.multipleTrip.controls[startFormArray].get('originArray').updateValueAndValidity();
        this.multipleTrip.controls[startFormArray].get('destinationArray').setValidators(Validators.required);
        this.multipleTrip.controls[startFormArray].get('destinationArray').updateValueAndValidity();
        this.multipleTrip.controls[startFormArray].get('departureArray').setValidators(Validators.required);
        this.multipleTrip.controls[startFormArray].get('departureArray').updateValueAndValidity();
      }
      this.returnDate = '';
    }
  };

  cityAutoCompleteArray(data, formorto, index) {
    const dataType = typeof data;
    if (dataType == 'object') {
      if (formorto == 'from') {
        this.fromCityArray[index] = data.city + ', ' + data.iata;
        this.formCityValueArray[index] = data.iata;
      } else if (formorto == 'to') {
        this.toCityArray[index] = data.city + ', ' + data.iata;
        this.toCityValueArray[index] = data.iata;
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

  addMultipleTrip() {
    this.multipleTripLength = this.multipleTrip.length;
    this.multipleTrip.push(this.fb.group({
      originArray: ['', Validators.compose([
        Validators.required,
      ])
      ],
      destinationArray: ['', Validators.compose([
        Validators.required,
      ])
      ],
      departureArray: ['', Validators.compose([
        Validators.required,
      ])
      ],
    }));

    var defaultCheckInDateFormatted = [];
    defaultCheckInDateFormatted[this.multipleTripLength - 1] = moment(this.defaultDepatureDateArray[this.multipleTripLength - 1].year + '-' + this.defaultDepatureDateArray[this.multipleTripLength - 1].month + '-' + this.defaultDepatureDateArray[this.multipleTripLength - 1].day).format('YYYY-MM-DD');
    var todayPlusLength = moment(defaultCheckInDateFormatted[this.multipleTripLength]).add(this.multipleTripLength + 1, 'days').toDate();
    this.defaultDepatureDateArray[this.multipleTripLength] = {
      'year': todayPlusLength.getFullYear(),
      'month': parseInt(moment(todayPlusLength).format('MM'), 0),
      'day': parseInt(moment(todayPlusLength).format('DD'), 0)
    };
  }

  removeMultipleTrip(index) {
    this.multipleTrip.removeAt(index);
    this.fromCityArray[this.multipleTrip.length] = '';
    this.formCityValueArray[this.multipleTrip.length] = '';
    this.toCityArray[this.multipleTrip.length] = '';
    this.toCityValueArray[this.multipleTrip.length] = '';
    this.multipleTripLength = this.multipleTrip.length - 1;
  }
}
