import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {APIService} from '../../../core/API';
import * as moment from 'moment';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {
  id: string;
  start_date: string;
  end_date: string;
  duration: string;
  loadingPage: boolean;
  detailHotel: any;

  public hotelDetailsCollapsed: boolean[] = [];
  private unsubscribe: Subject<any>;
  @ViewChild('scrollToMe', {static: false}) scrollToMe: ElementRef;

  constructor(
    private _router: ActivatedRoute,
    private api: APIService,
    private cdr: ChangeDetectorRef
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.loadingPage = true;
    this.id = this._router.snapshot.params['hotelID'];
    this.start_date = this._router.snapshot.params['startDate'];
    this.duration = this._router.snapshot.params['duration'];
    this.end_date = moment(this.start_date).add(this.duration, 'days').format('YYYY-MM-DD');

    this.api.getDetailHotel(this.id, this.start_date, this.end_date)
      .pipe(
        tap((data: any) => {
          this.detailHotel = data;
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loadingPage = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  hotelDetailsAllCollapsed(value) {
    if (!this.hotelDetailsCollapsed[value]) {
      this.hotelDetailsCollapsed = [false];
      this.hotelDetailsCollapsed[value] = false;
    } else {
      this.hotelDetailsCollapsed = [false];
      this.hotelDetailsCollapsed[value] = true;
    }
  }

  scroll() {
    setTimeout(() => {
      this.scrollToMe.nativeElement.scrollIntoView({behavior: 'smooth'});
    }, 200);
  }

}
