import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  searchHotelForm: FormGroup;
  defaultCheckInDate: any;
  minDate: any;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    var today = new Date();
    var todayPlusOne = moment(today).add(1, 'days').toDate();

    this.defaultCheckInDate = {
      'year': todayPlusOne.getFullYear(),
      'month': parseInt(moment(todayPlusOne).format('MM'), 0),
      'day': parseInt(moment(todayPlusOne).format('DD'), 0)
    };

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
      ]
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

}
