import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//pages
import {LandingpageComponent} from './views/pages/landingpage/landingpage.component';

const routes: Routes = [
	{
        path: '',
        component: LandingpageComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
