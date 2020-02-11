import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit, OnDestroy {
  loadingPage: boolean;

  airPricePort: any;
  passengerType: any;
  passengerLength: number;

  submitedPassengerData: any = [];

  bookingInfoForm: FormGroup;
  bookingForm: any = [];

  submitted = false;

  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.loadingPage = true;
    //start panggil function initBookingForm
    this.initBookingForm();
    //end panggil function initBookingForm
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initBookingForm() {
    this.route.params.subscribe(sessionID => {
      this.api.AirBookingGetDataDB(sessionID.sessionID).subscribe((AirBookingGetDataDB: any) => {
        this.api.AirPricePort(AirBookingGetDataDB.data).pipe(
          tap((AirPricePort: any) => {
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
          }),
          takeUntil(this.unsubscribe),
          finalize(() => {
            this.loadingPage = false;
            this.cdr.markForCheck();
          })
        ).subscribe();
      });
    });
  }

  submitBook() {
    this.submitted = true;
    this.submitedPassengerData = [];
    const controls = this.bookingInfoForm.controls;
    if (this.bookingInfoForm.invalid || this.bookingForm[0].invalid || this.bookingForm[1].invalid || this.bookingForm[2].invalid) {
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
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      // return;
    }

    for (var awal = 0; awal < this.passengerLength; awal++) {
      for (var awal2 = 0; awal2 < this.airPricePort.passengerType[awal].numPassenger; awal2++) {
        this.submitedPassengerData.push({
          passengerType: this.bookingForm[awal].controls[awal2].controls['passengerType'].value,
          passengerTitle: this.bookingForm[awal].controls[awal2].controls['passenger_title'].value,
          passengerFirstName: this.bookingForm[awal].controls[awal2].controls['passenger_firstname'].value,
          passengerLastName: this.bookingForm[awal].controls[awal2].controls['passenger_lastname'].value,
          passengerDOB: this.bookingForm[awal].controls[awal2].controls['passenger_dob'].value,
          passengerPassport: this.bookingForm[awal].controls[awal2].controls['passenger_passport'].value,
          passengerPassportExpiry: this.bookingForm[awal].controls[awal2].controls['passenger_passportexpiry'].value,
        });
      }
    }

    this.api.AirCreateReservationPort(this.submitedPassengerData, this.airPricePort).pipe(
      tap((data: any) => {
        console.log(data);
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    )
      .subscribe();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.bookingInfoForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  isControlHasErrorDynamic(controlName: string, validationType: string, awal: number, awal2: number): boolean {
    const control = this.bookingForm[awal].controls[awal2].controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
