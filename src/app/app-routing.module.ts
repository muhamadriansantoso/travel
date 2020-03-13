import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
//pages
import {LandingpageComponent} from './views/pages/landingpage/landingpage.component';
import {SearchFlightResultComponent} from './views/pages/search-flight-result/search-flight-result.component';
import {PrebookingComponent} from './views/pages/prebooking/prebooking.component';
import {CheckorderComponent} from './views/pages/checkorder/checkorder.component';
import {SeachHotelResultComponent} from './views/pages/seach-hotel-result/seach-hotel-result.component';

const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent
  },
  {
    path: 'search-flight',
    component: SearchFlightResultComponent
  },
  {
    path: 'search-hotel',
    component: SeachHotelResultComponent
  },
  {
    path: 'prebooking/:sessionID',
    component: PrebookingComponent
  },
  {
    path: 'retrieve-booking',
    component: CheckorderComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
