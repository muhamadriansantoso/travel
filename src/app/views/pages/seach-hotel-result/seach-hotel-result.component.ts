import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from '../../../core/API';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-seach-hotel-result',
  templateUrl: './seach-hotel-result.component.html',
  styleUrls: ['./seach-hotel-result.component.scss']
})
export class SeachHotelResultComponent implements OnInit {
  dataHotelSearch: any;
  loadingPage: boolean;
  start_date: string;
  end_date: string;
  duration: string;
  private unsubscribe: Subject<any>;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.loadingPage = true;
    this.route.queryParams.subscribe(params => {
      this.start_date = params.start_date;
      this.duration = params.duration;
      this.end_date = moment(this.start_date).add(this.duration, 'days').format('YYYY-MM-DD');
      this.api.searchHotel(params.geo, this.start_date, this.end_date)
        .pipe(
          tap((data: any) => {
            this.dataHotelSearch = data;
          }),
          takeUntil(this.unsubscribe),
          finalize(() => {
            this.loadingPage = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe();
    });
  }

  openDetail(id, start_date, duration) {
    this.router.navigate(['/detail-hotel', id, start_date, duration]);
  };

}
