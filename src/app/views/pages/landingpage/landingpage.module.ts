import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LandingpageComponent} from './landingpage.component';
import {FlightComponent} from './flight/flight.component';
import {HotelsComponent} from './hotels/hotels.component';
import {FlightAndHotelComponent} from './flight-and-hotel/flight-and-hotel.component';
import {PriceNumber} from '../pricenumber.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClickOutsideModule} from 'ng-click-outside';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {NguiAutoCompleteModule} from '@ngui/auto-complete';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';

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
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ClickOutsideModule,
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    HeaderComponent,
    FlightComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class LandingpageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LandingpageModule,
    };
  }
}
