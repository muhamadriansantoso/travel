import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, MatSnackBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_DATE_FORMATS, AppDateAdapter} from './views/pages/format-datepicker';
import {NgxSoapModule} from 'ngx-soap';
import {LandingpageModule} from './views/pages/landingpage/landingpage.module';
import {ClickOutsideModule} from 'ng-click-outside';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {SearchFlightResultComponent} from './views/pages/search-flight-result/search-flight-result.component';
import {MinuteToHour} from './views/pages/minutetohour.pipe';
import {PrebookingComponent} from './views/pages/prebooking/prebooking.component';
import {UniquePipe} from './views/pages/unique.pipe';
import {CheckboxFilterPipe} from './views/pages/search-flight-result/checkbox-filter.pipe';
import {ClipboardModule} from 'ngx-clipboard';
import {CountdownModule} from 'ngx-countdown';
import {NgWizardConfig, NgWizardModule, THEME} from 'ng-wizard';
import {SpacetoplusPipe} from './views/pages/spacetoplus.pipe';

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
    SpacetoplusPipe
  ],
  imports: [
    LandingpageModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    NgxSoapModule,
    ClickOutsideModule,
    AutocompleteLibModule,
    MatStepperModule,
    ClipboardModule,
    MatSnackBarModule,
    CountdownModule,
    NgbModule,
    NgWizardModule.forRoot(ngWizardConfig)
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
