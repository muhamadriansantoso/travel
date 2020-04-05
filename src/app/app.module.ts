import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_DATE_FORMATS, AppDateAdapter} from './views/pages/format-datepicker';
import {NgxSoapModule} from 'ngx-soap';
import {LandingpageModule} from './views/pages/landingpage/landingpage.module';
import {ClickOutsideModule} from 'ng-click-outside';
import {SearchFlightResultComponent} from './views/pages/search-flight-result/search-flight-result.component';
import {MinuteToHour} from './views/pages/minutetohour.pipe';
import {PrebookingComponent} from './views/pages/prebooking/prebooking.component';
import {UniquePipe} from './views/pages/unique.pipe';
import {CheckboxFilterPipe} from './views/pages/search-flight-result/checkbox-filter.pipe';
import {ClipboardModule} from 'ngx-clipboard';
import {CountdownModule} from 'ngx-countdown';
import {NgWizardConfig, NgWizardModule, THEME} from 'ng-wizard';
import {SpacetoplusPipe} from './views/pages/spacetoplus.pipe';
import {CheckorderComponent} from './views/pages/checkorder/checkorder.component';
import {SeachHotelResultComponent} from './views/pages/seach-hotel-result/seach-hotel-result.component';
import {HotelDetailComponent} from './views/pages/hotel-detail/hotel-detail.component';
import {UnderscoretoplusPipe} from './views/pages/underscoretoplus.pipe';
import {HotelBookingComponent} from './views/pages/hotel-booking/hotel-booking.component';
import {MomentModule} from 'ngx-moment';
import {ProgressBarModule} from "angular-progress-bar";
import {ESIMsBookingComponent} from './views/pages/e-sims-booking/e-sims-booking.component';
import {CommonModule} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule} from "@angular/material/core";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSnackBarModule} from "@angular/material/snack-bar";

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.arrows,
  toolbarSettings: {
    showNextButton: false,
    showPreviousButton: false
  }
};

@NgModule({
  declarations: [
    AppComponent,
    SearchFlightResultComponent,
    MinuteToHour,
    PrebookingComponent,
    UniquePipe,
    CheckboxFilterPipe,
    SpacetoplusPipe,
    UnderscoretoplusPipe,
    CheckorderComponent,
    SeachHotelResultComponent,
    HotelDetailComponent,
    HotelBookingComponent,
    ESIMsBookingComponent,
  ],
  imports: [
    CommonModule,
    LandingpageModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    NgxSoapModule,
    ClickOutsideModule,
    MatStepperModule,
    ClipboardModule,
    MatSnackBarModule,
    ProgressBarModule,
    CountdownModule,
    MomentModule,
    NgbModule,
    NgWizardModule.forRoot(ngWizardConfig),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
