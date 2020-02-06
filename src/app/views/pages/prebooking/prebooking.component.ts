import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(sessionID => {
      this.api.AirBookingGetDataDB(sessionID.sessionID).subscribe((AirBookingGetDataDB: any) => {
        this.api.AirPricePort(AirBookingGetDataDB.data).subscribe((AirPricePort: any) => {
        });
      });
    });
  }

}
