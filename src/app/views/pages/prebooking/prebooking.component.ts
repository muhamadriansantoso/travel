import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {APIService} from '../../../core/API';

@Component({
  selector: 'app-prebooking',
  templateUrl: './prebooking.component.html',
  styleUrls: ['./prebooking.component.scss']
})
export class PrebookingComponent implements OnInit {

  constructor(
    private router: Router,
    private api: APIService
  ) {
  }

  ngOnInit() {
    this.api.AirPricePort().subscribe((data: any) => {
      console.log(data);
    });
  }

}
