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

  dataFlightSearch: any = [];
  dataFlightAdvanced: any = [];
  airLine: string;
  airLineListUnique: any = [];
  transitListUnique: any = [];
  sessionID: string;
  loadingButton: boolean;
  loadingPage: boolean;
  searchFlightError: boolean;
  searchFlightErrorMessage: string;
  roundType: string;
  phase: boolean;
  origin: string;
  destination: string;

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
    this.phase = false;
    this.route.queryParams.subscribe(params => {
      this.roundType = params.type;
      this.origin = params.d;
      this.destination = params.a;
      if (this.roundType == 'one-way') {
        this.api.AirLowFareSearchPort(params.d, params.a, params.date, params.r_date, params.adult, params.child, params.infant, params.cabin, params.type)
          .pipe(
            tap((data: any) => {
              if (data.data.length > 0) {

                this.dataFlightSearch = data.data;
                this.sessionID = data.sessionID;
                this.airLine = data.data[0].transData[0].platingCarrierName;

                data.data.forEach((dataPesawat: any) => {
                  dataPesawat.transData.forEach((transData: any) => {
                    this.airLineListUnique.push({
                      value: transData.platingCarrierName
                    });
                  });

                  this.transitListUnique.push({
                    value: dataPesawat.stop
                  });
                });
              } else {
                this.searchFlightError = true;
                this.searchFlightErrorMessage = data.data.error;
              }
            }),
            takeUntil(this.unsubscribe),
            finalize(() => {
              this.loadingPage = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe();
      } else if (this.roundType == 'round-trip') {
        this.api.AirLowFareSearchPort(params.d, params.a, params.date, params.r_date, params.adult, params.child, params.infant, params.cabin, params.type)
          .pipe(
            tap((data: any) => {
              if (data.data.length > 0) {
                var ABC = 0;
                data.data.forEach((globalData: any) => {
                  globalData.departure.forEach((dataFlightSearch: any) => {
                    this.dataFlightSearch.push(dataFlightSearch);

                    globalData.departure.forEach((dataPesawat: any) => {
                      dataPesawat.transData.forEach((transData: any) => {
                        this.airLineListUnique.push({
                          value: transData.platingCarrierName
                        });
                      });

                      this.transitListUnique.push({
                        value: dataPesawat.stop
                      });
                    });

                    for (var i = 0; i < globalData.departure.length; i++) {
                      globalData.departure[i] = Object.assign(globalData.departure[i], {
                        return: data.data[ABC].return,
                      });
                    }
                  });

                  ABC = ABC + 1;
                });
                this.sessionID = data.sessionID;
                this.airLine = data.data[0].departure[0].transData[0].platingCarrierName;
              } else {
                this.searchFlightError = true;
                this.searchFlightErrorMessage = data.data.error;
              }
            }),
            takeUntil(this.unsubscribe),
            finalize(() => {
              this.loadingPage = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe();
      } else if (this.roundType == 'multiple-trip') {
        this.api.AirLowFareSearchPortArray(params.d, params.a, params.date, params.r_date, params.adult, params.child, params.infant, params.cabin, params.type)
          .pipe(
            tap((data: any) => {
              if (data.data.length > 0) {

                this.dataFlightSearch = data.data;
                this.sessionID = data.sessionID;
                this.airLine = data.data[0].transData[0].platingCarrierName;

                data.data.forEach((dataPesawat: any) => {
                  dataPesawat.transData.forEach((transData: any) => {
                    this.airLineListUnique.push({
                      value: transData.platingCarrierName
                    });
                  });

                  this.transitListUnique.push({
                    value: dataPesawat.stop
                  });
                });
              } else {
                this.searchFlightError = true;
                this.searchFlightErrorMessage = data.data.error;
              }
            }),
            takeUntil(this.unsubscribe),
            finalize(() => {
              this.loadingPage = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe();
      }
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

  returnShow(data) {
    this.phase = true;
    this.dataFlightAdvanced.push(data);
  }

  returnPrevious(data) {
    this.phase = false;
    this.dataFlightAdvanced = [];
  }

  navigateToBooking(sessionID, data) {
    this.loadingButton = true;
    this.dataFlightAdvanced.push(data);

    for (var i = 0; i < this.dataFlightAdvanced.length; i++) {
      this.dataFlightAdvanced[i] = Object.assign(this.dataFlightAdvanced[i], {
        origin: this.origin,
        destination: this.destination,
        roundType: this.roundType
      });
    }

    this.api.AirBookingInsertDB(sessionID, JSON.stringify(this.dataFlightAdvanced))
      .pipe(
        tap((data: any) => {
          if (data.status == 1) {
            this.router.navigate(['prebooking', data.sessionID]);
          } else if (data.status == 0) {
            window.location.reload();
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loadingButton = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  checkedAirline() {
    return this.airLineListUnique.filter(airline => {
      return airline.checked;
    });
  }

  checkedTransit() {
    return this.transitListUnique.filter(transit => {
      return transit.checked;
    });
  }

  searchInvalidPopUPHide(value) {
    if (value == 'redirectkehome') {
      this.searchFlightError = false;
      this.router.navigate(['/']);
    }
  }

}
