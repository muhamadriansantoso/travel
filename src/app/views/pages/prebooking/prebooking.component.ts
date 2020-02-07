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

  ngOnInit() {
    //start panggil function initBookingForm
    this.initBookingForm();
    //end panggil function initBookingForm
  }

  initBookingForm() {
    this.route.params.subscribe(sessionID => {
      this.api.AirBookingGetDataDB(sessionID.sessionID).subscribe((AirBookingGetDataDB: any) => {
        this.api.AirPricePort(AirBookingGetDataDB.data).subscribe((AirPricePort: any) => {
          this.airPricePort = AirPricePort.data[0];
          this.passengerType = AirPricePort.data[0].passengerType;
          this.passengerLength = AirPricePort.data[0].passengerType.length;

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
          });
          //endbookinginfoform

          //start looping passenger form dynamically
          for (var passengerTypeLength = 0; passengerTypeLength < this.passengerLength; passengerTypeLength++) {
            this.bookingForm[passengerTypeLength] = new FormArray([]);
            for (var passengerNumLength = 0; passengerNumLength < AirPricePort.data[0].passengerType[passengerTypeLength].numPassenger; passengerNumLength++) {
              this.bookingForm[passengerTypeLength].push(this.fb.group({
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
    });
  }

  submitBook() {
    this.submitted = true;
    this.bookingForm.forEach((data: any) => {
        console.log(data);
        if (this.bookingInfoForm.invalid || data.invalid) {
          const controls = this.bookingInfoForm.controls;
          Object.keys(controls).forEach(controlName =>
            controls[controlName].markAsTouched()
          );

          alert('Data Belum Lengkap');

          return false;
        }
      }
    );
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.bookingInfoForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
