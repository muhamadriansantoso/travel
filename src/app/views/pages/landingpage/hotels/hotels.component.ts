import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {APIService} from '../../../../core/API';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  searchHotelForm: FormGroup;
  defaultCheckInDate: any;
  defaultCheckInDateFormatted: any;
  minDate: any;
  geoList: any;
  geoName: any;
  geoID: string;
  durationIndex: any[] = [];
  durationStayDate: any[] = [];

  searchHotelFormInvalid: boolean;
  checkinDate: string;
  checkoutDate: string;

  constructor(
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.api.hotelGeolocation().subscribe((data: any) => {
      this.geoList = data;
      this.cdr.detectChanges();
    });

    var today = new Date();
    var todayPlusOne = moment(today).add(1, 'days').toDate();

    this.defaultCheckInDate = {
      'year': todayPlusOne.getFullYear(),
      'month': parseInt(moment(todayPlusOne).format('MM'), 0),
      'day': parseInt(moment(todayPlusOne).format('DD'), 0)
    };

    this.defaultCheckInDateFormatted = moment(this.defaultCheckInDate.year + '-' + this.defaultCheckInDate.month + '-' + this.defaultCheckInDate.day).format('YYYY-MM-DD');

    for (var duration = 1; duration <= 14; duration++) {
      this.durationIndex.push(duration);
      this.durationStayDate.push(moment(this.defaultCheckInDateFormatted).add(duration, 'days').format('YYYY-MM-DD'));
    }

    this.minDate = {
      'year': today.getFullYear(),
      'month': parseInt(moment(today).format('MM'), 0),
      'day': parseInt(moment(today).format('DD'), 0)
    };

    this.searchHotelForm = this.fb.group({
      destination: ['', Validators.compose([
        Validators.required,
      ])
      ],
      checkindate: ['', Validators.compose([
        Validators.required,
      ])
      ],
      duration: ['1', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `
<div style="margin-bottom: 4px;">
<span style="font-size: 14px; line-height: 20px; font-weight: 500" class="">${data.name}</span>
</div>
<div>
</div>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  getGeoID(data) {
    const dataType = typeof data;
    if (dataType == 'object') {
      this.geoName = data.name;
      this.geoID = data.id;
    } else {
      this.geoName = '';
      this.geoID = '';
    }
  }

  searchHotel() {
    const controls = this.searchHotelForm.controls;
    if (this.searchHotelForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.searchHotelFormInvalid = true;
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      return;
    }

    const authData = {
      checkindate: controls['checkindate'].value,
      duration: controls['duration'].value,
    };

    this.checkinDate = moment(authData.checkindate.year + '-' + authData.checkindate.month + '-' + authData.checkindate.day).format('YYYY-MM-DD');
    this.checkoutDate = moment(this.checkinDate).add(authData.duration, 'days').format('YYYY-MM-DD');

    this.router.navigate(['/search-hotel'], {
      queryParams:
        {
          geo: '',
          start_date: this.checkinDate,
          end_date: this.checkoutDate,
        },
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.searchHotelForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  changeCheckInDate() {
    this.defaultCheckInDateFormatted = moment(this.defaultCheckInDate.year + '-' + this.defaultCheckInDate.month + '-' + this.defaultCheckInDate.day).format('YYYY-MM-DD');
    this.durationIndex = [];
    this.durationStayDate = [];
    for (var duration = 1; duration <= 14; duration++) {
      this.durationIndex.push(duration);
      this.durationStayDate.push(moment(this.defaultCheckInDateFormatted).add(duration, 'days').format('YYYY-MM-DD'));
    }
  }

}
