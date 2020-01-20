import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LandingpageComponent} from './landingpage.component';
import {FlightComponent} from './flight/flight.component';
import { HotelsComponent } from './hotels/hotels.component';
import { FlightAndHotelComponent } from './flight-and-hotel/flight-and-hotel.component';
import {PriceNumber} from '../pricenumber.pipe';
import {MinuteToHour} from '../minutetohour.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ClickOutsideModule} from 'ng-click-outside';

const routes: Routes = [
    {
        path: '',
        component: LandingpageComponent,
        children: [
            {
                path: '',
                component: FlightComponent,
            },
            {
                path: 'flight',
                component: FlightComponent,
            },
            {
                path: 'flight-and-hotel',
                component: FlightAndHotelComponent,
            },
            {
                path: 'hotel',
                component: HotelsComponent,
            },
        ]
    }
];

@NgModule({
    declarations: [
        LandingpageComponent,
        FlightComponent,
        HotelsComponent,
        FlightAndHotelComponent,
        PriceNumber,
        MinuteToHour,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ClickOutsideModule,
        RouterModule.forChild(routes),
    ]
})
export class LandingpageModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LandingpageModule,
        };
    }
}
