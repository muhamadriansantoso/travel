import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APIService} from '../../../core/API';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

    model: any;

    listPlaceFrom: any;
    listPlaceFromWrite: boolean = false;
    listPlaceTo: any;
    listPlaceToWrite: boolean = false;

    landingPageFormGroups: FormGroup;

    constructor(
        private http: HttpClient,
        private api: APIService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.initLandingPageForm();
        this.model = {
            originplace: '',
            originplaceInput: '',
            destinationplace: '',
            outboundpartialdate: '',
            inboundpartialdate: '',
        };
    }

    initLandingPageForm() {
        this.landingPageFormGroups = this.fb.group({
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
                console.log(this.listPlaceFrom);
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
                console.log(this.listPlaceTo);
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

}
