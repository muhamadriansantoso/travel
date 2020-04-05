import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {APIService} from "../../../core/API";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {finalize, takeUntil, tap} from "rxjs/operators";
import * as moment from "moment";
import * as io from 'socket.io-client';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-e-sims-booking',
  templateUrl: './e-sims-booking.component.html',
  styleUrls: ['./e-sims-booking.component.scss']
})
export class ESIMsBookingComponent implements OnInit {
  isLinear: boolean;
  loadingPage: boolean;
  sessionID: any;

  bankCode: any;
  productCode: any;

  stepBookingDetailsComplete: boolean;
  stepPayComplete: boolean;
  stepProcessComplete: boolean;
  stepperIndex: number;
  bookingID: string;
  packageData: string;

  validateBookingLoader: boolean;
  bookingFailurePopUP: boolean;
  bookingDataFormInvalid: boolean;
  priceUpdatedInformation: boolean;
  paymentFailed: boolean;
  paymentSuccess: boolean;

  bookingInfoForm: FormGroup;
  paymentChannel: FormGroup;

  listPaymentChannel: any;

  paymentData: any;
  currentDateTime: any;
  transferExpiredTime: any;
  leftTimePayment: any;
  socket;

  submitted = false;

  private unsubscribe: Subject<any>;
  @ViewChild('stepper') private myStepper: MatStepper;

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _location: Location
  ) {
    this.unsubscribe = new Subject();
    this.socket = io('https://fixtrips.com:3000/');
  }

  ngOnInit() {
    this.loadingPage = true;
    this.isLinear = true;
    this.initBookingForm();
    this.paymentChannelForm();
  }

  initBookingForm() {
    this.route.params.subscribe(sessionID => {
      this.sessionID = sessionID.sessionID;
      this.api.AirBookingGetDataDB(this.sessionID).pipe(
        tap((eSIMsGetDataDB: any) => {
          if (eSIMsGetDataDB.status == 1) {
            this.stepBookingDetailsComplete = false;
            this.stepPayComplete = false;
            this.stepProcessComplete = false;
            this.stepperIndex = 0;
          } else if (eSIMsGetDataDB.status == 2) {
            this.stepBookingDetailsComplete = true;
            this.stepPayComplete = true;
            this.stepProcessComplete = false;
            this.stepperIndex = 1;
            this.isLinear = false;
            this.bookingID = eSIMsGetDataDB.bookingID;
            this.hitAPICheckPayment();
          } else if (eSIMsGetDataDB.status == 3) {
            this.stepBookingDetailsComplete = true;
            this.stepPayComplete = true;
            this.stepProcessComplete = true;
            this.paymentSuccess = true;
            this.bookingID = eSIMsGetDataDB.bookingID;
            this.stepperIndex = 2;
          }

          this.packageData = eSIMsGetDataDB.data;

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
            email: ['', Validators.compose([
              Validators.required,
              Validators.email
            ])
            ]
          });
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loadingPage = false;
          this.cdr.markForCheck();
        })
      ).subscribe();
    });
  }

  paymentChannelForm() {
    this.paymentChannel = this.fb.group({
      bankCode: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  paymentChannelSelected(bankCode, productCode) {
    this.bankCode = bankCode;
    this.productCode = productCode;
  }

  hitAPICheckPayment() {
    this.api.checkPaymentChannelEspay(this.bookingID).pipe(
      tap((data: any) => {
        if (data.status == 1) {
          this.paymentData = data.data;
          this.currentDateTime = moment(new Date()).unix();
          this.transferExpiredTime = moment(data.data.expired).unix();
          this.leftTimePayment = this.transferExpiredTime - this.currentDateTime;
          if (this.leftTimePayment > 0) {
            this.leftTimePayment = this.transferExpiredTime - this.currentDateTime;
          } else {
            this.leftTimePayment = 0;
          }

          this.socket.emit('checkpaymentstatus', {
            id: this.bookingID
          });
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.validateBookingLoader = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  submitBook() {
    this.submitted = true;
    const controls = this.bookingInfoForm.controls;
    if (this.bookingInfoForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.bookingDataFormInvalid = true;
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      return;
    }

    this.validateBookingLoader = true;

    const dataBooking = {
      title: controls['title'].value,
      firstname: controls['firstname'].value,
      lastname: controls['lastname'].value,
      email: controls['email'].value,
    };

    this.api.eSIMsInsertBooking(this.sessionID, dataBooking.title, dataBooking.firstname, dataBooking.lastname, dataBooking.email, 'airalo').pipe(
      tap((data: any) => {
        if (data.status == 1) {
          this.bookingID = data.orderID;
          this.api.paymentChannelEspay(this.sessionID).pipe(
            tap((data: any) => {
              if (data.status == 1) {
                this.listPaymentChannel = data.data.data;
                this.sessionID = data.sessionID;
                this.bookingID = data.id;
                this.stepBookingDetailsComplete = true;
                this.myStepper.next();
              } else {
                this.bookingFailurePopUP = true;
              }
            }),
            takeUntil(this.unsubscribe),
            finalize(() => {
              this.validateBookingLoader = false;
              this.cdr.markForCheck();
            })
          ).subscribe();
        } else {
          this.bookingFailurePopUP = true;
          this.validateBookingLoader = false;
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

      this.bookingDataFormInvalid = true;
      //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
      return;
    }

    const dataBooking = {
      bankCode: controls['bankCode'].value
    };

    this.validateBookingLoader = true;

    this.api.insertPaymentChannelEspay(this.bookingID, dataBooking.bankCode, '', '', '', 'esims', '').pipe(
      tap((data: any) => {
        if (data.status == 1) {
          this.stepPayComplete = true;
          this.hitAPICheckPayment();
        } else {
          // this.paymentFailed = true;
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.validateBookingLoader = false;
        this.myStepper.next();
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.bookingInfoForm.controls[controlName];
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

  bookingFailurePopUPHide(value) {
    if (value == 'redirectkehome') {
      this.bookingFailurePopUP = false;
      this.router.navigate(['/']);
    } else if (value == 'redirectback') {
      this._location.back();
    }
    this.bookingDataFormInvalid = false;
    this.priceUpdatedInformation = false;
    this.paymentFailed = false;
  }

  coppied() {
    this.snackBar.open('Copied', '', {
      duration: 1000,
    });
  }

}
