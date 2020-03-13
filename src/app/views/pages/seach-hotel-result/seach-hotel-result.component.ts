import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from '../../../core/API';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-seach-hotel-result',
  templateUrl: './seach-hotel-result.component.html',
  styleUrls: ['./seach-hotel-result.component.scss']
})
export class SeachHotelResultComponent implements OnInit {
  dataHotelSearch: any;
  loadingPage: boolean;
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
      this.api.searchHotel(params.geo, params.start_date, params.end_date)
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

}
