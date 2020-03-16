import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../core/API';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.scss']
})
export class HotelBookingComponent implements OnInit {
  sessionID: string;
  loadingPage: boolean;
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
    this.route.params.subscribe(sessionID => {
      this.sessionID = sessionID.sessionID;
      console.log(this.sessionID);
      this.api.HotelBookingGetDataDB(this.sessionID).subscribe((HotelBookingGetDataDB: any) => {

      });
    });
  }

}
