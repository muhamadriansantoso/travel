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
  passengerType: any;
  bookingForm: any = [];
  passengerLength: any;

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
          this.passengerType = AirPricePort.data[0].passengerType;
          this.passengerLength = AirPricePort.data[0].passengerType.length;


          for (var passengerTypeLength = 0; passengerTypeLength < this.passengerLength; passengerTypeLength++) {
            this.bookingForm[passengerTypeLength] = new FormArray([]);
            for (var passengerNumLength = 0; passengerNumLength < AirPricePort.data[0].passengerType[passengerTypeLength].numPassenger; passengerNumLength++) {
              this.bookingForm[passengerTypeLength].push(this.formBuilder.group({
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                passengerType: AirPricePort.data[0].passengerType[passengerTypeLength].code
              }));
            }
          }
        });
      });
    });
  }

}
