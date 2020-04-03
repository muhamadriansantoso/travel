import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APIService} from "../../../../core/API";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-esims',
  templateUrl: './esims.component.html',
  styleUrls: ['./esims.component.scss']
})
export class EsimsComponent implements OnInit {
  eSIMsData: any;

  constructor(
    private http: HttpClient,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.api.geteSIMs('local').subscribe((data: any) => {
      if (data.data.status == 1) {
        this.eSIMsData = data.data.data;
      }
      this.cdr.detectChanges();
    });
  }

}
