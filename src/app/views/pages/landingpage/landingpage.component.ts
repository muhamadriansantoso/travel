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

    private unsubscribe: Subject<any>;
    private subscriptions: Subscription[] = [];

    constructor(
        private http: HttpClient,
        private api: APIService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.unsubscribe = new Subject();
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
        this.model.defaultDatePlusSevenDay = dateFormat(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7), 'yyyy-mm-dd');

        this.api.APIBrowseDates().subscribe((data:any)=>{
            this.browseDatesQuotes = data.Quotes;
            this.browseDatesCarriers = data.Carriers;
            this.browseDatesPlaces = data.Places;
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
    }

    onSubmit(){
        const controls1 = this.landingPageFormGroups.controls;

        if (this.landingPageFormGroups.invalid) {
            Object.keys(controls1).forEach(controlName =>
                controls1[controlName].markAsTouched()
            );
            return;
        }

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
                .subscribe();
        } else if (authData.flightChooseTab == 1){
            this.api.APIBrowseDates().subscribe((data:any)=>{
                this.browseDatesQuotes = data.Quotes;
                this.browseDatesCarriers = data.Carriers;
                this.browseDatesPlaces = data.Places;
            });
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
