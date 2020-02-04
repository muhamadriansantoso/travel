import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from '../../../core/API';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-search-flight-result',
    templateUrl: './search-flight-result.component.html',
    styleUrls: ['./search-flight-result.component.scss']
})
export class SearchFlightResultComponent implements OnInit {

    dataFlightSearch: any;
    loadingPage: boolean;

    public flightDetailsCollapsed: boolean[] = [];
    public priceDetailsCollapsed: boolean[] = [];
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
            this.api.AirLowFareSearchPort(params.d, params.a, params.date, params.r_date, params.adult, params.child, params.infant, params.cabin, params.type)
                .pipe(
                    tap((data: any) => {
                        this.dataFlightSearch = data.data;
                      console.log(this.dataFlightSearch);
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

    flightDetailsAllCollapsed(value) {
        if (!this.flightDetailsCollapsed[value]) {
            this.flightDetailsCollapsed = [false];
            this.priceDetailsCollapsed = [false];
            this.flightDetailsCollapsed[value] = false;
        } else {
            this.flightDetailsCollapsed = [false];
            this.priceDetailsCollapsed = [false];
            this.flightDetailsCollapsed[value] = true;
        }
    }

    priceDetailsAllCollapsed(value) {
        if (!this.priceDetailsCollapsed[value]) {
            this.priceDetailsCollapsed = [false];
            this.flightDetailsCollapsed = [false];
            this.priceDetailsCollapsed[value] = false;
        } else {
            this.priceDetailsCollapsed = [false];
            this.flightDetailsCollapsed = [false];
            this.priceDetailsCollapsed[value] = true;
        }
    }

}
