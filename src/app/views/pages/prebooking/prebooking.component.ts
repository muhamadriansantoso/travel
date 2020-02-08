import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit {

  sessionID: any;
  dataFromDB: any;
  airPricePort: any;
  passengerType: any;
  bookingInfoForm: FormGroup;
  bookingForm: any = [];
  passengerLength: any;

  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService,
    private fb: FormBuilder
  ) {
  }

  get bif() {
    return this.bookingInfoForm.controls;
  }

  get df() {
    return this.bif.dynamicForm as FormArray;
  }

  ngOnInit() {
    //start get sessionID
    this.route.params.subscribe(sessionID => {
      this.sessionID = sessionID.sessionID;
    });
    //start panggil function initBookingForm
    this.initBookingForm();
    //end panggil function initBookingForm
  }

  initBookingForm() {
    //bookingInfoForm
    this.bookingInfoForm = this.fb.group({
      title: ['Mr', Validators.compose([
        Validators.required,
      ])
      ],
      firstname: ['', Validators.compose([
        Validators.required,
      ])
      ],
      lastname: ['', Validators.compose([
        Validators.required,
      ])
      ],
      dob: ['', Validators.compose([
        Validators.required,
      ])
      ],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])
      ],
      phone: ['', Validators.compose([
        Validators.required,
      ])
      ],
      dynamicForm: new FormArray([])
    });
    //endbookinginfoform

    this.api.AirBookingGetDataDB(this.sessionID).subscribe((AirBookingGetDataDB: any) => {
      this.dataFromDB = AirBookingGetDataDB;
      this.api.AirPricePort(this.dataFromDB.data).subscribe((AirPricePort: any) => {
        this.airPricePort = AirPricePort.data[0];
        this.passengerType = AirPricePort.data[0].passengerType;
        this.passengerLength = AirPricePort.data[0].passengerType.length;

        //start looping passenger form dynamically
        for (var passengerTypeLength = 0; passengerTypeLength < this.passengerLength; passengerTypeLength++) {
          for (var passengerNumLength = 0; passengerNumLength < AirPricePort.data[0].passengerType[passengerTypeLength].numPassenger; passengerNumLength++) {
            this.df.push(this.fb.group({
              passenger_title: ['Mr', Validators.compose([
                Validators.required,
              ])
              ],
              passenger_firstname: ['', Validators.compose([
                Validators.required,
              ])
              ],
              passenger_lastname: ['', Validators.compose([
                Validators.required,
              ])
              ],
              passenger_dob: ['', Validators.compose([
                Validators.required,
              ])
              ],
              passenger_passport: ['', Validators.compose([
                Validators.required,
              ])
              ],
              passenger_passportexpiry: ['', Validators.compose([
                Validators.required,
              ])
              ],
              passengerType: AirPricePort.data[0].passengerType[passengerTypeLength].code
            }));
          }
        }
        //end looping passenger form dynamically
      });
    });
  }

  submitBook() {
    this.submitted = true;
    if (this.bookingInfoForm.invalid || this.bookingForm[0].invalid || this.bookingForm[1].invalid || this.bookingForm[2].invalid) {
      const controls = this.bookingInfoForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      for (var awal = 0; awal < this.passengerLength; awal++) {
        for (var awal2 = 0; awal2 < this.airPricePort.passengerType[awal].numPassenger; awal2++) {
          Object.keys(this.bookingForm[awal].controls[awal2].controls).forEach(controlName =>
            this.bookingForm[awal].controls[awal2].controls[controlName].markAsTouched()
          );
        }
      }

      alert('Data Belum Lengkap');
    } else {
      alert('Submit');
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.bookingInfoForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  isControlHasErrorDynamic(controlName: string, validationType: string): boolean {
    for (var awal = 0; awal < this.passengerLength; awal++) {
      for (var awal2 = 0; awal2 < this.airPricePort.passengerType[awal].numPassenger; awal2++) {
        if (!this.bookingForm[awal].controls[awal2].controls[controlName]) {
          return false;
        }

        const result = this.bookingForm[awal].controls[awal2].controls[controlName].hasError(validationType) && (this.bookingForm[awal].controls[awal2].controls[controlName].dirty || this.bookingForm[awal].controls[awal2].controls[controlName].touched);
        return result;
      }
    }
  }

}
