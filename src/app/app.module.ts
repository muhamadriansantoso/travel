import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingpageComponent} from './views/pages/landingpage/landingpage.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_DATE_FORMATS, AppDateAdapter} from './views/pages/format-datepicker';

@NgModule({
    declarations: [
        AppComponent,
        LandingpageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule
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
