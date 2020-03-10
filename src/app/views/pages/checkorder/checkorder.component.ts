import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from '../../../core/API';

@Component({
  selector: 'app-checkorder',
  templateUrl: './checkorder.component.html',
  styleUrls: ['./checkorder.component.scss']
})
export class CheckorderComponent implements OnInit {

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  submit() {
    this.api.retrieveBooking('rian_santoso@ymail.com', '1').subscribe((data: any) => {
      console.log(data);
      this.cdr.detectChanges();
    });
  }

}
