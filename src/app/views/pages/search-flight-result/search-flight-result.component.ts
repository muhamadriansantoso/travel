import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from '../../../core/API';

@Component({
  selector: 'app-search-flight-result',
  templateUrl: './search-flight-result.component.html',
  styleUrls: ['./search-flight-result.component.scss']
})
export class SearchFlightResultComponent implements OnInit {

  dataFlightSearch: any;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.api.AirLowFareSearchPort().subscribe((data: any) => {
      this.dataFlightSearch = data.data;
      this.cdr.detectChanges();
    });
  }

}
