import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {MatSnackBar, MatStepper} from '@angular/material';
import * as moment from 'moment';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit, OnDestroy {
  loadingPage: boolean;

  sessionID: any;
  bookingID: any;
  stepperIndex: any;
  airPricePort: any;
  passengerType: any;
  passengerLength: number;
  nonUpdatedPrice: any;
  updatedPrice: any;

  listPaymentChannel: any;
  paymentData: any;
  currentDateTime: any;
  transferExpiredTime: any;
  leftTimePayment: any;
  bankCode: any;
  productCode: any;
  minDateAdult: any;
  maxDateAdult: any;
  minDateChild: any;
  maxDateChild: any;
  minDateInfant: any;
  maxDateInfant: any;
  passportExpiredMinDate: any;
  passportExpiredMaxDate: any;

  submitedPassengerData: any = [];

  bookingInfoForm: FormGroup;
  paymentChannel: FormGroup;
  bookingForm: any = [];

  submitted = false;

  origin: string;
  destination: string;
  originCityName: string;
  destinationCityName: string;
  departureTime: string;
  airPlane: string;

  isLinear: boolean;
  stepBookingDetailsComplete: boolean;
  stepPayComplete: boolean;
  stepProcessComplete: boolean;

  validateBookingLoader: boolean;
  bookingFailurePopUP: boolean;
  bookingDataFormInvalid: boolean;
  priceUpdatedInformation: boolean;
  paymentFailed: boolean;
  paymentSuccess: boolean;

  socket;

  private unsubscribe: Subject<any>;
  @ViewChild('stepper', {static: false}) private myStepper: MatStepper;

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.unsubscribe = new Subject();
    this.socket = io('http://gohateka.com:3000/');
  }

  ngOnInit() {
    this.loadingPage = true;
    this.isLinear = true;

    this.initBookingForm();
    this.paymentChannelForm();
    this.checkingPaymentbySocketIO();
  }

  ngOnDestroy(): void {
    this.loadingPage = false;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initBookingForm() {
    this.route.params.subscribe(sessionID => {
      this.sessionID = sessionID.sessionID;
      this.api.AirBookingGetDataDB(this.sessionID).subscribe((AirBookingGetDataDB: any) => {
        this.nonUpdatedPrice = AirBookingGetDataDB.data.totalPrice;
        this.origin = AirBookingGetDataDB.data.transData[0].origin;
        this.destination = AirBookingGetDataDB.data.transData[0].destination;
        this.originCityName = AirBookingGetDataDB.data.transData[0].origin_city_name;
        this.destinationCityName = AirBookingGetDataDB.data.transData[0].destination_city_name;
        this.departureTime = AirBookingGetDataDB.data.transData[0].departureTime;
        this.airPlane = AirBookingGetDataDB.data.transData[0].platingCarrierName;

        if (AirBookingGetDataDB.status == 1) {
          this.stepBookingDetailsComplete = false;
          this.stepPayComplete = false;
          this.stepProcessComplete = false;
          this.stepperIndex = 0;
        } else if (AirBookingGetDataDB.status == 2) {
          this.stepBookingDetailsComplete = true;
          this.stepPayComplete = true;
          this.stepProcessComplete = false;
          this.stepperIndex = 1;
          this.isLinear = false;
          this.bookingID = AirBookingGetDataDB.bookingID;
          this.hitAPICheckPayment();
        } else if (AirBookingGetDataDB.status == 3) {
          this.stepBookingDetailsComplete = true;
          this.stepPayComplete = true;
          this.stepProcessComplete = true;
          this.paymentSuccess = true;
          this.bookingID = AirBookingGetDataDB.bookingID;
          this.stepperIndex = 2;
        }
        this.api.AirPricePort(AirBookingGetDataDB.data).pipe(
          tap((AirPricePort: any) => {
            this.airPricePort = AirPricePort.data[0];
            this.passengerType = AirPricePort.data[0].passengerType;
            this.passengerLength = AirPricePort.data[0].passengerType.length;
            this.updatedPrice = AirPricePort.data[0].totalPrice;

            var bookingDate = moment(AirPricePort.data[0].airSegment[0].DepartureTime).toDate();
            this.minDateAdult = {
              'year': bookingDate.getFullYear() - 100,
              'month': parseInt(moment(bookingDate).format('MM'), 0),
              'day': parseInt(moment(bookingDate).format('DD'), 0)
            };
            this.maxDateAdult = {
              'year': bookingDate.getFullYear() - 12,
              'month': parseInt(moment(bookingDate).format('MM'), 0),
              'day': parseInt(moment(bookingDate).format('DD'), 0)
            };

            this.minDateChild = {
              'year': bookingDate.getFullYear() - 12,
              'month': parseInt(moment(bookingDate).format('MM'), 0),
              'day': parseInt(moment(bookingDate).format('DD'), 0) + 1
            };
            this.maxDateChild = {
              'year': bookingDate.getFullYear() - 2,
              'month': parseInt(moment(bookingDate).format('MM'), 0),
              'day': parseInt(moment(bookingDate).format('DD'), 0)
            };

            this.minDateInfant = {
              'year': bookingDate.getFullYear() - 2,
              'month': parseInt(moment(bookingDate).format('MM'), 0),
              'day': parseInt(moment(bookingDate).format('DD'), 0) + 1
            };
            this.maxDateInfant = {
              'year': bookingDate.getFullYear(),
              'month': parseInt(moment(bookingDate).format('MM'), 0) - 1,
              'day': parseInt(moment(bookingDate).format('DD'), 0)
            };

            this.passportExpiredMinDate = {
              'year': bookingDate.getFullYear(),
              'month': parseInt(moment(bookingDate).format('MM'), 0) + 6,
              'day': parseInt(moment(bookingDate).format('DD'), 0) + 1
            };

            this.passportExpiredMaxDate = {
              'year': bookingDate.getFullYear() + 24,
              'month': parseInt(moment(bookingDate).format('MM'), 0),
              'day': parseInt(moment(bookingDate).format('DD'), 0) + 1
            };

            if (this.nonUpdatedPrice != this.updatedPrice) {
              this.priceUpdatedInformation = true;
            }

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
              dob: ['', Validators.compose([
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
                  passenger_dob: ['', Validators.compose([
                    Validators.required,
                  ])
                  ],
                  passenger_passport: ['1234567890', Validators.compose([
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

  paymentChannelForm() {
    this.paymentChannel = this.fb.group({
      bankCode: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  submitBook() {
    this.submitted = true;
    this.submitedPassengerData = [];
    const controls = this.bookingInfoForm.controls;
    if (this.bookingForm.length == 1) {
      if (this.bookingInfoForm.invalid || this.bookingForm[0].invalid) {
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

        this.bookingDataFormInvalid = true;
        //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
        return;
      }
    } else {
      for (var bookingFormlength = 0; bookingFormlength < this.bookingForm.length; bookingFormlength++) {
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

          this.bookingDataFormInvalid = true;
          //di retrun biar kalo kondisi invalid ga lanjut ke tahap berikutnya
          return;
        }
      }
    }

    this.validateBookingLoader = true;

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

    var dob = moment(dataBooking.dob.year + '-' + dataBooking.dob.month + '-' + dataBooking.dob.day).format('YYYY-MM-DD');

    this.api.AirCreateReservationPort(this.sessionID, dataBooking.title, dataBooking.firstname, dataBooking.lastname, dob, dataBooking.email, dataBooking.phone).pipe(
      tap((data: any) => {
        if (data.status == 1) {
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
    var departureTimeModified = moment(this.departureTime, 'YYYY-MM-DDhh:mm:ss').format('YYYY-MM-DD hh:mm:ss');

    this.api.insertPaymentChannelEspay(this.bookingID, dataBooking.bankCode, this.origin, this.originCityName, this.destination, this.destinationCityName, departureTimeModified, this.airPlane).pipe(
      tap((data: any) => {
        if (data.status == 1) {
          this.stepPayComplete = true;
          this.hitAPICheckPayment();
        } else {
          this.paymentFailed = true;
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

  checkingPaymentbySocketIO() {
    this.socket.on('initial notes', (data: any) => {
      if (data.payment_status == 'PAID') {
        this.stepBookingDetailsComplete = true;
        this.stepPayComplete = true;
        this.stepProcessComplete = true;
        this.paymentSuccess = true;
        this.myStepper.next();
      }
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

  bookingFailurePopUPHide(value) {
    if (value == 'redirectkehome') {
      this.bookingFailurePopUP = false;
      this.router.navigate(['/']);
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
