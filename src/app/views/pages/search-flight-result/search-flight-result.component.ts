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
  multiplePhase: number;
  multiplePhaseIndex: number;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adult: string;
  child: string;
  infant: string;
  cabin: string;
  dataMultiTrip: any = [];
  dataMultiTripStep: number;
  sortByWhat: number;
  currentPercent: any;
  progressPercent: any;
  hideProgressBar: boolean;
  supplierData: any;

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
    this.multiplePhase = 0;
    this.sortByWhat = 0;
    this.progressPercent = 0;
    this.hideProgressBar = false;
    this.route.queryParams.subscribe(params => {
      this.origin = params.d;
      this.destination = params.a;
      this.departureDate = params.date;
      this.returnDate = params.r_date;
      this.adult = params.adult;
      this.child = params.child;
      this.cabin = params.cabin;
      this.roundType = params.type;

      this.api.getFlightSupplier().toPromise().then((data: any) => {
        this.supplierData = data;
        this.getAPIFromSupplier(data.length);
      });
    });
  }

  async getAPIFromSupplier(length) {
    if (this.roundType == 'one-way') {
      for (var abc = 0; abc < length; abc++) {
        await this.api.AirLowFareSearchPort(this.origin, this.destination, this.departureDate, this.returnDate, this.adult, this.child, this.infant, this.cabin, this.roundType, this.supplierData[abc].code)
          .toPromise().then((data: any) => {
            if (data.data.length > 0) {
              if (abc == 0) {
                this.dataFlightSearch = data.data;
              } else if (abc > 0) {
                data.data.forEach((dataPesawat: any) => {
                  this.dataFlightSearch.push(dataPesawat);
                });
              }
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
          });

        this.loadingPage = false;
        this.currentPercent = abc + 1;
        var totalPercent = length;
        this.progressPercent = (this.currentPercent / totalPercent) * 100;

        if (this.progressPercent == 100) {
          setTimeout(() => {
            this.hideProgressBar = true;
          }, 1000);
        }
      }
    } else if (this.roundType == 'round-trip') {
      this.api.AirLowFareSearchPort(this.origin, this.destination, this.departureDate, this.returnDate, this.adult, this.child, this.infant, this.cabin, this.roundType, this.supplierData[abc].code)
        .pipe(
          tap((data: any) => {
            if (data.data.length > 0) {
              this.dataMultiTrip = data.data;
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
      this.api.AirLowFareSearchPortArray(this.origin, this.destination, this.departureDate, this.returnDate, this.adult, this.child, this.infant, this.cabin, this.roundType, this.supplierData[abc].code)
        .pipe(
          tap((data: any) => {
            if (data.data.length > 0) {
              var ABC = 0;
              this.dataMultiTripStep = data.data[0].flightSession.length;
              this.dataMultiTrip = data.data;
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
                      index: ABC
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
    }
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
    this.airLineListUnique = [];
    this.transitListUnique = [];
    this.dataFlightAdvanced.push(data);
    this.dataFlightAdvanced[0].return.forEach((globalData: any) => {
      globalData.transData.forEach((transData: any) => {
        this.airLineListUnique.push({
          value: transData.platingCarrierName
        });
      });

      this.transitListUnique.push({
        value: globalData.stop
      });
    });
  }

  returnShowMultiple(data, index) {
    this.dataFlightAdvanced.push(data);
    this.multiplePhase = this.multiplePhase + 1;
    if (index == undefined) {
      this.multiplePhaseIndex = this.multiplePhaseIndex;
    } else {
      this.airLineListUnique = [];
      this.transitListUnique = [];
      this.multiplePhaseIndex = index;
      this.dataMultiTrip[this.multiplePhaseIndex].flightSession[this.multiplePhase - 1].forEach((globalData: any) => {
        globalData.transData.forEach((transData: any) => {
          this.airLineListUnique.push({
            value: transData.platingCarrierName
          });
        });

        this.transitListUnique.push({
          value: globalData.stop
        });
      });
    }
  }

  returnPrevious(data) {
    if (this.roundType == 'round-trip') {
      this.dataFlightAdvanced = [];
      this.dataFlightSearch = [];
      this.phase = false;
      this.dataMultiTrip.forEach((globalData: any) => {
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
        });
      });
    } else if (this.roundType == 'multiple-trip') {
      this.multiplePhase = 0;
      this.dataFlightAdvanced = [];
      this.dataFlightSearch = [];

      this.dataMultiTrip.forEach((globalData: any) => {
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
        });
      });
    }
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

  sortingSearchResult(value) {
    this.sortByWhat = value;
  }

  searchInvalidPopUPHide(value) {
    if (value == 'redirectkehome') {
      this.searchFlightError = false;
      this.router.navigate(['/']);
    }
  }

}
