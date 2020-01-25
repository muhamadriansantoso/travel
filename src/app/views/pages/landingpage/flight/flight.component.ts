import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIService} from '../../../../core/API';
import {FormBuilder} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

    airportList: any;

    constructor(
        private http: HttpClient,
        private api: APIService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private _sanitizer: DomSanitizer
    ) {
    }

    adultPassenger: number;
    childPassenger: number;
    infantPassenger: number;
    roundType: string;
    public passengersCollapsed: boolean = false;

    ngOnInit() {
        this.adultPassenger = 1;
        this.childPassenger = 0;
        this.infantPassenger = 0;
        this.roundType = 'oneway';

        this.api.airportList().subscribe((data: any) => {
            this.airportList = data;
            this.cdr.detectChanges();
        });
    }

    autocompleListFormatter = (data: any) : SafeHtml => {
        let html = `<div class="listbox"><div class=""><div style="margin-bottom: 4px;"><span class="">${data.city}, ${data.country}</span></div><div><span class="">${data.iata} - ${data.name}</span></div></div></div> `;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    showPassengerIn(){
        this.passengersCollapsed = !this.passengersCollapsed;
    }

    showPassengerOut(e: Event){
        this.passengersCollapsed = false;
    }

    typeRound(value){
        this.roundType = value;
    }

    adultPassengerMinus() {
        if (this.adultPassenger > 1){
            this.adultPassenger = this.adultPassenger - 1;
        } else {
            return false;
        }
    }

    adultPassengerPlus() {
        this.adultPassenger = this.adultPassenger + 1;
    }

    childPassengerMinus() {
        if (this.childPassenger > 0){
            this.childPassenger = this.childPassenger - 1;
        } else {
            return false;
        }
    }

    childPassengerPlus() {
        this.childPassenger = this.childPassenger + 1;
    }

    infantPassengerMinus() {
        if (this.infantPassenger > 0){
            this.infantPassenger = this.infantPassenger - 1;
        } else {
            return false;
        }
    }

    infantPassengerPlus() {
        this.infantPassenger = this.infantPassenger + 1;
    }

    selectEvent(item) {
        // do something with selected item
    }

    onChangeSearch(search: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e) {
        // do something
    }

}
