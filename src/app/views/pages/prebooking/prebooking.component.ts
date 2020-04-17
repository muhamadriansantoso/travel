import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Location} from '@angular/common';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatStepper} from "@angular/material/stepper";


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
  internationalRoute: number;
  nonUpdatedPrice: any;
  updatedPrice: any;
  roundType: string;
  airSegmentData: any;
  totalPrice: number;
  baggageDataSSR: any;
  baggageDataSSRChoosen: any = [];
  baggageDataSSRCode: string;
  baggageDataSSRPrice: any = [];

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

  paymentStatus: string;
  origin: string;
  destination: string;
  departureTime: string;
  airPlane: string;
  supplier: string;

  isLinear: boolean;
  stepBookingDetailsComplete: boolean;
  stepPayComplete: boolean;
  stepProcessComplete: boolean;

  flightNotAvailable: boolean;
  validateBookingLoader: boolean;
  bookingFailurePopUP: boolean;
  bookingDataFormInvalid: boolean;
  priceUpdatedInformation: boolean;
  paymentFailed: boolean;
  paymentSuccess: boolean;

  socket;

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
    this.baggageDataSSRCode = '';

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
        this.internationalRoute = AirBookingGetDataDB.international_route;
        this.nonUpdatedPrice = AirBookingGetDataDB.data[0].totalPrice;
        this.origin = AirBookingGetDataDB.data[0].origin;
        this.destination = AirBookingGetDataDB.data[0].destination;
        this.departureTime = AirBookingGetDataDB.data[0].transData[0].departureTime;
        this.airPlane = AirBookingGetDataDB.data[0].transData[0].platingCarrierName;
        this.paymentStatus = AirBookingGetDataDB.payment_status;
        this.roundType = AirBookingGetDataDB.data[0].roundType;

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
        this.api.AirPricePort(this.sessionID).pipe(
          tap((AirPricePort: any) => {
            if (AirPricePort.data.error != undefined) {
              this.flightNotAvailable = true;
            }
            this.airPricePort = AirPricePort.data[0];
            this.passengerType = AirPricePort.data[0].passengerType;
            this.passengerLength = AirPricePort.data[0].passengerType.length;
            this.updatedPrice = AirPricePort.data[0].totalPrice;
            this.totalPrice = AirPricePort.data[0].totalPrice;
            this.supplier = AirPricePort.data[0].id;

            this.airSegmentData = AirPricePort.data[0].airSegmentData;
            if (AirPricePort.data[0].baggageSSRData != undefined) {
              this.baggageDataSSR = AirPricePort.data[0].baggageSSRData;

              this.baggageDataSSR.forEach((data: any, index: number) => {
                this.baggageDataSSRPrice[index] = {
                  SegmentIndex: index,
                  price: 0,
                };
              });
            } else {
              this.baggageDataSSR = [];
            }

            this.baggageDataSSRPrice = Object.assign(this.baggageDataSSRPrice, {
              totalPrice: 0
            });

            var bookingDate = moment(AirPricePort.data[0].airSegment[0].DepartureTime).toDate();
            var bookingminDateAdult = moment(bookingDate).subtract(100, 'years').toDate();
            var bookingmaxDateAdult = moment(bookingDate).subtract(12, 'years').toDate();
            var bookingminDateChild = moment(bookingDate).subtract(12, 'years').add(1, 'days').toDate();
            var bookingmaxDateChild = moment(bookingDate).subtract(2, 'years').toDate();
            var bookingminDateInfant = moment(bookingDate).subtract(2, 'years').toDate();
            var bookingmaxDateInfant = moment(bookingDate).subtract(1, 'months').toDate();
            var bookingpassportExpiredMinDate = moment(bookingDate).add(6, 'months').add(1, 'days').toDate();
            var bookingpassportExpiredMaxDate = moment(bookingDate).add(24, 'years').add(1, 'days').toDate();

            this.minDateAdult = {
              'year': bookingminDateAdult.getFullYear(),
              'month': parseInt(moment(bookingminDateAdult).format('MM'), 0),
              'day': parseInt(moment(bookingminDateAdult).format('DD'), 0)
            };
            this.maxDateAdult = {
              'year': bookingmaxDateAdult.getFullYear(),
              'month': parseInt(moment(bookingmaxDateAdult).format('MM'), 0),
              'day': parseInt(moment(bookingmaxDateAdult).format('DD'), 0)
            };

            this.minDateChild = {
              'year': bookingminDateChild.getFullYear(),
              'month': parseInt(moment(bookingminDateChild).format('MM'), 0),
              'day': parseInt(moment(bookingminDateChild).format('DD'), 0)
            };
            this.maxDateChild = {
              'year': bookingmaxDateChild.getFullYear(),
              'month': parseInt(moment(bookingmaxDateChild).format('MM'), 0),
              'day': parseInt(moment(bookingmaxDateChild).format('DD'), 0)
            };

            this.minDateInfant = {
              'year': bookingminDateInfant.getFullYear(),
              'month': parseInt(moment(bookingminDateInfant).format('MM'), 0),
              'day': parseInt(moment(bookingminDateInfant).format('DD'), 0)
            };
            this.maxDateInfant = {
              'year': bookingmaxDateInfant.getFullYear(),
              'month': parseInt(moment(bookingmaxDateInfant).format('MM'), 0),
              'day': parseInt(moment(bookingmaxDateInfant).format('DD'), 0)
            };

            this.passportExpiredMinDate = {
              'year': bookingpassportExpiredMinDate.getFullYear(),
              'month': parseInt(moment(bookingpassportExpiredMinDate).format('MM'), 0),
              'day': parseInt(moment(bookingpassportExpiredMinDate).format('DD'), 0)
            };
            this.passportExpiredMaxDate = {
              'year': bookingpassportExpiredMaxDate.getFullYear(),
              'month': parseInt(moment(bookingpassportExpiredMaxDate).format('MM'), 0),
              'day': parseInt(moment(bookingpassportExpiredMaxDate).format('DD'), 0)
            };

            if (this.nonUpdatedPrice != this.updatedPrice && this.paymentStatus == null) {
              this.priceUpdatedInformation = true;
            }

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
            var passengerIndex = 0;
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
                  passenger_baggageSSR: [''],
                  passengerType: AirPricePort.data[0].passengerType[passengerTypeLength].code,
                  passengerIndex: passengerIndex
                }));

                passengerIndex += 1;
              }
            }
            //end looping passenger form dynamically

            if (this.internationalRoute == 0) {
              for (var awal = 0; awal < this.passengerLength; awal++) {
                for (var awal2 = 0; awal2 < this.airPricePort.passengerType[awal].numPassenger; awal2++) {
                  this.bookingForm[awal].controls[awal2].get('passenger_passport').setValidators([]);
                  this.bookingForm[awal].controls[awal2].get('passenger_passport').updateValueAndValidity();
                  this.bookingForm[awal].controls[awal2].get('passenger_passportexpiry').setValidators([]);
                  this.bookingForm[awal].controls[awal2].get('passenger_passportexpiry').updateValueAndValidity();
                }
              }
            }
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
        var passengerDob = moment(this.bookingForm[awal].controls[awal2].controls['passenger_dob'].value.year + '-' + this.bookingForm[awal].controls[awal2].controls['passenger_dob'].value.month + '-' + this.bookingForm[awal].controls[awal2].controls['passenger_dob'].value.day).format('YYYY-MM-DD');
        var passengerPassportExpiry: any;
        if (this.internationalRoute == 0) {
          passengerPassportExpiry = null;
        } else {
          passengerPassportExpiry = moment(this.bookingForm[awal].controls[awal2].controls['passenger_passportexpiry'].value.year + '-' + this.bookingForm[awal].controls[awal2].controls['passenger_passportexpiry'].value.month + '-' + this.bookingForm[awal].controls[awal2].controls['passenger_passportexpiry'].value.day).format('YYYY-MM-DD');
        }
        this.submitedPassengerData.push({
          passengerType: this.bookingForm[awal].controls[awal2].controls['passengerType'].value,
          passengerTitle: this.bookingForm[awal].controls[awal2].controls['passenger_title'].value,
          passengerFirstName: this.bookingForm[awal].controls[awal2].controls['passenger_firstname'].value,
          passengerLastName: this.bookingForm[awal].controls[awal2].controls['passenger_lastname'].value,
          passengerDOB: passengerDob,
          passengerPassport: this.bookingForm[awal].controls[awal2].controls['passenger_passport'].value,
          passengerPassportExpiry: passengerPassportExpiry,
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

    this.api.AirCreateReservationPort(this.sessionID, dataBooking.title, dataBooking.firstname, dataBooking.lastname, dob, dataBooking.email, dataBooking.phone, this.submitedPassengerData, this.supplier).pipe(
      tap((data: any) => {
        if (data.status == 1) {
          this.bookingID = data.orderID;
          this.api.paymentChannelEspayForFlight(this.sessionID).pipe(
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

    if (this.baggageDataSSRChoosen.length > 0) {
      this.api.AirCreateSSR(this.bookingID, this.baggageDataSSRChoosen, this.supplier).pipe(
        tap((data: any) => {
          if (data.status == 1) {
            this.api.insertPaymentChannelEspayForFlight(this.bookingID, dataBooking.bankCode, this.origin, this.destination, departureTimeModified, this.airPlane, this.roundType).pipe(
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
          } else {
            // this.paymentFailed = true;
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.cdr.markForCheck();
        })
      ).subscribe();
    } else {
      this.api.insertPaymentChannelEspayForFlight(this.bookingID, dataBooking.bankCode, this.origin, this.destination, departureTimeModified, this.airPlane, this.roundType).pipe(
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
    this.api.checkPaymentChannelEspayForFlight(this.bookingID, this.supplier).pipe(
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

          this.socket.emit('checkpaymentstatusforflight', {
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

  updateBaggageSSRData(index, segmentIndex, passengerIndex) {
    var keepGoing = true;
    this.baggageDataSSRChoosen.forEach((data: any, i: number) => {
      if (passengerIndex == data.PassengerNumber && segmentIndex == data.SegmentIndex && index != '') {
        this.baggageDataSSRCode = this.baggageDataSSR[segmentIndex].ssrData[index].SSRCode;
        this.baggageDataSSRChoosen[i] = {
          departure: this.baggageDataSSR[segmentIndex].departure,
          arrival: this.baggageDataSSR[segmentIndex].arrival,
          SSRCode: this.baggageDataSSRCode,
          PassengerNumber: passengerIndex,
          SegmentIndex: segmentIndex,
          price: this.baggageDataSSR[segmentIndex].ssrData[index].Amount,
          data: this.baggageDataSSR[segmentIndex].ssrData[index].subSSRData
        };
        keepGoing = false;
      } else if (passengerIndex == data.PassengerNumber && segmentIndex == data.SegmentIndex && index == '') {
        this.baggageDataSSRCode = '';
        this.baggageDataSSRChoosen.splice(i, 1);
        keepGoing = false;
      }
    });

    if (keepGoing == true) {
      this.baggageDataSSRCode = this.baggageDataSSR[segmentIndex].ssrData[index].SSRCode;
      this.baggageDataSSRChoosen.push({
        departure: this.baggageDataSSR[segmentIndex].departure,
        arrival: this.baggageDataSSR[segmentIndex].arrival,
        SSRCode: this.baggageDataSSRCode,
        PassengerNumber: passengerIndex,
        SegmentIndex: segmentIndex,
        price: this.baggageDataSSR[segmentIndex].ssrData[index].Amount,
        data: this.baggageDataSSR[segmentIndex].ssrData[index].subSSRData
      });
    }

    var temp = {};
    var obj = null;
    if (this.baggageDataSSRChoosen.length == 0) {
      temp[segmentIndex] = {
        SegmentIndex: segmentIndex,
        price: 0,
      };

      this.baggageDataSSRPrice[segmentIndex] = temp[segmentIndex];
    } else {
      for (var i = 0; i < this.baggageDataSSRChoosen.length; i++) {
        obj = this.baggageDataSSRChoosen[i];
        if (!temp[obj.SegmentIndex]) {
          temp[obj.SegmentIndex] = {
            SegmentIndex: obj.SegmentIndex,
            price: obj.price,
          };
        } else {
          temp[obj.SegmentIndex].price += obj.price;
        }

        this.baggageDataSSRPrice[obj.SegmentIndex] = temp[obj.SegmentIndex];
      }
    }

    var totalPrice = this.baggageDataSSRPrice.reduce((a, b) => a + (parseInt(b['price']) || 0), 0);

    this.baggageDataSSRPrice = Object.assign(this.baggageDataSSRPrice, {
      totalPrice: totalPrice
    });

    // console.log(this.baggageDataSSRChoosen);
    // console.log(this.baggageDataSSRPrice);
  }


}
