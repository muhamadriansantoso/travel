import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormArray, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit {

  airPricePort: any;
  airPricePortPassengerNum: any;
  bookingForm: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(sessionID => {
      this.api.AirBookingGetDataDB(sessionID.sessionID).subscribe((AirBookingGetDataDB: any) => {
        this.api.AirPricePort(AirBookingGetDataDB.data).subscribe((AirPricePort: any) => {
          this.airPricePort = AirPricePort.data[0];
          this.airPricePortPassengerNum = AirPricePort.data[0].passengerType.length;

          this.bookingForm = new FormArray([]);

          for (let i = 0; i < this.airPricePortPassengerNum; i++) {
            this.bookingForm.push(this.formBuilder.group({
              name: ['', Validators.required],
              email: ['', [Validators.required, Validators.email]]
            }));
          }
        });
      });
    });
  }

}
