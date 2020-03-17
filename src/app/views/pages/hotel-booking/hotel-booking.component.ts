import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import {finalize, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.scss']
})
export class HotelBookingComponent implements OnInit {
  sessionID: string;
  bookingID: any;
  loadingPage: boolean;

  bookingInfoForm: FormGroup;
  paymentChannel: FormGroup;

  isLinear: boolean;
  stepBookingDetailsComplete: boolean;
  stepperIndex: any;
  stepPayComplete: boolean;
  stepProcessComplete: boolean;
  paymentSuccess: boolean;

  bookingDate: string;
  checkoutDate: string;
  duration: number;
  data: any;
  room_data: any;
  room_price: number;

  dataHotel: any;
  socket;
  private unsubscribe: Subject<any>;

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
  }

  initBookingForm() {
    this.route.params.subscribe(sessionID => {
      this.sessionID = sessionID.sessionID;
      this.api.HotelBookingGetDataDB(this.sessionID).pipe(
        tap((dataHotel: any) => {
          this.bookingDate = moment(dataHotel.check_in).format('dddd, DD MMM YYYY');
          this.duration = dataHotel.duration;
          this.checkoutDate = moment(dataHotel.check_in).add(this.duration, 'days').format('DD MMM YYYY');
          this.data = dataHotel.data;
          this.room_data = dataHotel.room_data;
          this.room_price = dataHotel.room_price;
          if (dataHotel.status == 1) {
            this.stepBookingDetailsComplete = false;
            this.stepPayComplete = false;
            this.stepProcessComplete = false;
            this.stepperIndex = 0;
          } else if (dataHotel.status == 2) {
            this.stepBookingDetailsComplete = true;
            this.stepPayComplete = true;
            this.stepProcessComplete = false;
            this.stepperIndex = 1;
            this.isLinear = false;
            this.bookingID = dataHotel.bookingID;
            // this.hitAPICheckPayment();
          } else if (dataHotel.status == 3) {
            this.stepBookingDetailsComplete = true;
            this.stepPayComplete = true;
            this.stepProcessComplete = true;
            this.paymentSuccess = true;
            this.bookingID = dataHotel.bookingID;
            this.stepperIndex = 2;
          }
          this.dataHotel = dataHotel;

          //bookingInfoForm
          this.bookingInfoForm = this.fb.group({
            guestname: ['', Validators.compose([
              Validators.required,
            ])
            ],
            contactname: ['', Validators.compose([
              Validators.required,
            ])
            ],
            email: ['', Validators.compose([
              Validators.required,
              Validators.email
            ])
            ],
            phone: ['', Validators.compose([
              Validators.required
            ])
            ]
          });
          //endbookinginfoform
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

}
