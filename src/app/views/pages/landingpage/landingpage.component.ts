import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APIService} from '../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import * as dateFormat from 'dateformat';
import localeId from '@angular/common/locales/id';
import {registerLocaleData} from '@angular/common';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';


registerLocaleData(localeId, 'id');

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit, OnDestroy {

    model: any;

    loading: boolean = false;

    listPlaceFrom: any;
    listPlaceFromWrite: boolean = false;
    listPlaceTo: any;
    listPlaceToWrite: boolean = false;

    browseDatesQuotes: any;
    browseDatesCarriers: any;
    browseDatesPlaces: any;

    landingPageFormGroups: FormGroup;

    minDate: any;

    intA: number;
    intB: number;
    showDiagnostic: boolean;
    message: string;
    xmlResponse: string;
    jsonResponse: string;
    resultLabel: string;
    client: Client;

    public submitClicked = false;
    private unsubscribe: Subject<any>;
    private subscriptions: Subscription[] = [];

    constructor(
        private http: HttpClient,
        private api: APIService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private soap: NgxSoapService
    ) {
        this.unsubscribe = new Subject();
        let headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        this.soap.createClient('https://www.w3schools.com/xml/tempconvert.asmx?WSDL', {headers: headers})
            .then(client => {
                console.log('Client', client);
                this.client = client;
            })
            .catch(err => console.log('Error', err));
    }

    celsiusToFahrenheit() {
        this.loading = true;
        const body = {
            intA: this.intA,
        };

        this.client.call('CelsiusToFahrenheit', body).subscribe(res => {
            this.xmlResponse = res.responseBody;
            this.message = res.result.AddResult;
            this.loading = false;
        }, err => console.log(err));
    }

    ngOnInit() {
        this.initLandingPageForm();
        const date = new Date();
        this.model = {
            flightChooseTab: '0',
            originplace: '',
            originplaceInput: '',
            destinationplace: '',
            outboundpartialdate: '',
            inboundpartialdate: '',
            minDate: '',
            defaultDatePlusSevenDay: '',
        };

        this.minDate = dateFormat(new Date(), 'yyyy-mm-dd', 'en');
        this.model.minDate = this.minDate.toString();
        this.model.defaultDatePlusSevenDay = dateFormat(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7), '');

        this.landingPageFormGroups.valueChanges.subscribe(value => {
            this.submitClicked = false;
        });

        this.cdr.detectChanges();
    }

    initLandingPageForm() {
        this.landingPageFormGroups = this.fb.group({
            flightChooseTab: ['', Validators.compose([Validators.required])],
            originplace: ['', Validators.compose([Validators.required])],
            originplaceInput: ['', Validators.compose([Validators.required])],
            destinationplace: ['', Validators.compose([Validators.required])],
            destinationplaceInput: ['', Validators.compose([Validators.required])],
            outboundpartialdate: ['', Validators.compose([Validators.required])],
            inboundpartialdate: [''],
        });
    }

    getListPlaceFrom(value: string) {
        if (value.length >= 2) {
            this.api.APIListPlace(value).subscribe((data: any) => {
                this.listPlaceFromWrite = true;

                let placeName = [];
                data.Places.forEach((data: any) => {
                    placeName.push(
                        {placename: data.PlaceName + ', ' + data.PlaceId, placeid: data.PlaceId}
                    );
                });

                this.listPlaceFrom = placeName;
            });
        } else {
            this.listPlaceFrom = '';
            this.listPlaceFromWrite = false;
        }
    }

    getListPlaceTo(value: string) {
        if (value.length >= 2) {
            this.api.APIListPlace(value).subscribe((data: any) => {
                this.listPlaceToWrite = true;

                let placeName = [];
                data.Places.forEach((data: any) => {
                    placeName.push(
                        {placename: data.PlaceName + ', ' + data.PlaceId, placeid: data.PlaceId}
                    );
                });

                this.listPlaceTo = placeName;
            });
        } else {
            this.listPlaceTo = '';
            this.listPlaceToWrite = false;
        }
    }

    clickPlaceFrom(placeid: string, placename: string) {
        this.listPlaceFromWrite = false;
        this.model.originplace = placeid;
        this.model.originplaceInput = placename;
    }

    clickPlaceTo(placeid: string, placename: string) {
        this.listPlaceToWrite = false;
        this.model.destinationplace = placeid;
        this.model.destinationplaceInput = placename;
    }

    flightChooseTabFunc(value){
        this.model.flightChooseTab = value;

        if (this.model.flightChooseTab == 0) {
            this.landingPageFormGroups.get('inboundpartialdate').setValidators(Validators.required);
            this.landingPageFormGroups.get('inboundpartialdate').updateValueAndValidity();
        } else if (this.model.flightChooseTab == 1) {
            this.landingPageFormGroups.get('inboundpartialdate').setValidators([]);
            this.landingPageFormGroups.get('inboundpartialdate').updateValueAndValidity();
        }
    }

    onSubmit(){
        const controls1 = this.landingPageFormGroups.controls;

        if (this.landingPageFormGroups.invalid) {
            Object.keys(controls1).forEach(controlName =>
                controls1[controlName].markAsTouched()
            );
            return;
        }

        this.submitClicked = true;
        this.loading = true;

        var outboundpartialdate = dateFormat(controls1['outboundpartialdate'].value, 'yyyy-mm-dd');
        var inboundpartialdate = dateFormat(controls1['inboundpartialdate'].value, 'yyyy-mm-dd');

        const authData = {
            flightChooseTab: controls1['flightChooseTab'].value,
            originplace: controls1['originplace'].value,
            originplaceInput: controls1['originplaceInput'].value,
            destinationplace: controls1['destinationplace'].value,
            destinationplaceInput: controls1['destinationplaceInput'].value,
            outboundpartialdate: outboundpartialdate,
            inboundpartialdate: inboundpartialdate,
        };

        if(authData.flightChooseTab == 0){
            this.api.APIBrowseDatesInboound(authData.originplace, authData.destinationplace, authData.outboundpartialdate, authData.inboundpartialdate)
                .pipe(
                    tap((data: any) => {
                        this.browseDatesQuotes = data.Quotes;
                        this.browseDatesCarriers = data.Carriers;
                        this.browseDatesPlaces = data.Places;
                    }),
                    takeUntil(this.unsubscribe),
                    finalize(() => {
                        this.loading = false;
                        this.cdr.markForCheck();
                    })
                )
                .subscribe(
                    () => {},
                    (error:any) => {
                        if(error.status == '400'){

                        }
                    }
                );
        } else if (authData.flightChooseTab == 1){
            this.api.APIBrowseDates(authData.originplace, authData.destinationplace, authData.outboundpartialdate)
                .pipe(
                    tap((data: any) => {
                        this.browseDatesQuotes = data.Quotes;
                        this.browseDatesCarriers = data.Carriers;
                        this.browseDatesPlaces = data.Places;
                    }),
                    takeUntil(this.unsubscribe),
                    finalize(() => {
                        this.loading = false;
                        this.cdr.markForCheck();
                    })
                )
                .subscribe(
                    () => {},
                    (error:any) => {
                        if(error.status == '400'){

                        }
                    }
                );
        }

    }

    showDepartureTimeFlight(){
        const controls1 = this.landingPageFormGroups.controls;

        if (this.landingPageFormGroups.invalid) {
            Object.keys(controls1).forEach(controlName =>
                controls1[controlName].markAsTouched()
            );
            return;
        }

        this.submitClicked = true;
        this.loading = true;

        var outboundpartialdate = dateFormat(controls1['outboundpartialdate'].value, 'yyyy-mm-dd');
        var inboundpartialdate = dateFormat(controls1['inboundpartialdate'].value, 'yyyy-mm-dd');

        const authData = {
            flightChooseTab: controls1['flightChooseTab'].value,
            originplace: controls1['originplace'].value,
            originplaceInput: controls1['originplaceInput'].value,
            destinationplace: controls1['destinationplace'].value,
            destinationplaceInput: controls1['destinationplaceInput'].value,
            outboundpartialdate: outboundpartialdate,
            inboundpartialdate: inboundpartialdate,
        };

        if(authData.flightChooseTab == 0){
            this.api.APIBrowseQuotesInboound(authData.originplace, authData.destinationplace, authData.outboundpartialdate, authData.inboundpartialdate)
                .pipe(
                    tap((data: any) => {
                        this.browseDatesQuotes = data.Quotes;
                        this.browseDatesCarriers = data.Carriers;
                        this.browseDatesPlaces = data.Places;
                    }),
                    takeUntil(this.unsubscribe),
                    finalize(() => {
                        this.loading = false;
                        this.cdr.markForCheck();
                    })
                )
                .subscribe(
                    () => {},
                    (error:any) => {
                        if(error.status == '400'){

                        }
                    }
                );
        } else if (authData.flightChooseTab == 1){
            this.api.APIBrowseDates(authData.originplace, authData.destinationplace, authData.outboundpartialdate)
                .pipe(
                    tap((data: any) => {
                        this.browseDatesQuotes = data.Quotes;
                        this.browseDatesCarriers = data.Carriers;
                        this.browseDatesPlaces = data.Places;
                    }),
                    takeUntil(this.unsubscribe),
                    finalize(() => {
                        this.loading = false;
                        this.cdr.markForCheck();
                    })
                )
                .subscribe(
                    () => {},
                    (error:any) => {
                        if(error.status == '400'){

                        }
                    }
                );
        }
    }

    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.landingPageFormGroups.controls[controlName];
        if (!control) {
            return false;
        }

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

}
