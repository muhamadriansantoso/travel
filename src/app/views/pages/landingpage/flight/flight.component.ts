import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

    constructor() {
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

}
