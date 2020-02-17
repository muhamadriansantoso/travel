import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit, OnDestroy {
  loadingPage: boolean;

  sessionID: any;
  bookingID: any;
  airPricePort: any;
  passengerType: any;
  passengerLength: number;

  listPaymentChannel: any;
  bankCode: any;
  productCode: any;

  submitedPassengerData: any = [];

  bookingInfoForm: FormGroup;
  payForm: FormGroup;
  paymentChannel: FormGroup;
  bookingForm: any = [];

  submitted = false;

  validateBookingLoader: boolean;
  bookingFailurePopUP: boolean;

  private unsubscribe: Subject<any>;
  @ViewChild('stepper', {static: false}) private myStepper: MatStepper;

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
    this.initBookingForm();
    this.paymentChannelForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initBookingForm() {
    this.route.params.subscribe(sessionID => {
      this.sessionID = sessionID.sessionID;
      this.api.AirBookingGetDataDB(this.sessionID).subscribe((AirBookingGetDataDB: any) => {
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
              firstname: ['Muhamad', Validators.compose([
                Validators.required,
              ])
              ],
              lastname: ['Rian', Validators.compose([
                Validators.required,
              ])
              ],
              dob: ['1996-09-13', Validators.compose([
                Validators.required,
              ])
              ],
              email: ['rian_santoso@ymail.com', Validators.compose([
                Validators.required,
                Validators.email
              ])
              ],
              phone: ['085783126998', Validators.compose([
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
                  passenger_firstname: ['Aldy', Validators.compose([
                    Validators.required,
                  ])
                  ],
                  passenger_lastname: ['Septi', Validators.compose([
                    Validators.required,
                  ])
                  ],
                  passenger_dob: ['1998-01-01', Validators.compose([
                    Validators.required,
                  ])
                  ],
                  passenger_passport: ['1234567890', Validators.compose([
                    Validators.required,
                  ])
                  ],
                  passenger_passportexpiry: ['2031-12-31', Validators.compose([
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

  paymentChannelForm() {
    this.paymentChannel = this.fb.group({
      bankCode: ['', Validators.compose([
        Validators.required,
      ])
      ],
      productCode: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  submitBook() {
    this.submitted = true;
    this.submitedPassengerData = [];
    this.validateBookingLoader = true;
    const controls = this.bookingInfoForm.controls;
    for (var bookingFormlength = 0; bookingFormlength < this.bookingForm[0].length; bookingFormlength++) {
      if (this.bookingInfoForm.invalid || this.bookingForm[bookingFormlength].invalid) {
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
        return;
      }
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

    const dataBooking = {
      title: controls['title'].value,
      firstname: controls['firstname'].value,
      lastname: controls['lastname'].value,
      dob: controls['dob'].value,
      email: controls['email'].value,
      phone: controls['phone'].value,
    };

    this.api.AirCreateReservationPort(this.sessionID, dataBooking.title, dataBooking.firstname, dataBooking.lastname, dataBooking.dob, dataBooking.email, dataBooking.phone).pipe(
      tap((data: any) => {
        if (data.status == 1) {
          this.api.paymentChannelEspay(this.sessionID).pipe(
            tap((data: any) => {
              if (data.status == 1) {
                this.listPaymentChannel = data.data.data;
                this.sessionID = data.sessionID;
                this.bookingID = data.id;
              } else {
                this.bookingFailurePopUP = true;
              }
            }),
            takeUntil(this.unsubscribe),
            finalize(() => {
              this.validateBookingLoader = false;
              this.myStepper.next();
              this.cdr.markForCheck();
            })
          ).subscribe();
        } else {
          this.bookingFailurePopUP = true;
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  submitPayment() {
    const controls = this.paymentChannel.controls;
    if (this.paymentChannel.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      alert('Data Belum Lengkap');
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      return;
    }

    const dataBooking = {
      bankCode: controls['bankCode'].value,
      productCode: controls['productCode'].value
    };

    this.api.insertPaymentChannelEspay(this.bookingID, dataBooking.bankCode, dataBooking.productCode).subscribe();
  }

  paymentChannelSelected(bankCode, productCode) {
    this.bankCode = bankCode;
    this.productCode = productCode;
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

  isControlHasErrorPayment(controlName: string, validationType: string): boolean {
    const control = this.paymentChannel.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  bookingFailurePopUPHide() {
    this.bookingFailurePopUP = false;
  }

}
