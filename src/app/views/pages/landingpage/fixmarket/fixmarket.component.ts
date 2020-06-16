import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {APIService} from "../../../../core/API";
import {Router} from "@angular/router";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from 'moment';

@Component({
  selector: 'app-fixmarket',
  templateUrl: './fixmarket.component.html',
  styleUrls: ['./fixmarket.component.scss']
})
export class FixmarketComponent implements OnInit {
  customOptions: OwlOptions = {
    items: 8,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    loop: true,
    navSpeed: 500,
    autoplay: true,
    nav: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
  };

  produkPromo: OwlOptions = {
    items: 3,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    loop: true,
    navSpeed: 500,
    autoplay: true,
    nav: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
  };

  pleaseWaitLoader: boolean;
  kategoripilihan: any;
  palingPopuler: any;
  produk: any;
  palingTerlaris: any;
  searchProductForm: FormGroup;
  searchProductFormInvalid: boolean;
  currentDate: any;
  tomorrowDate: any;
  hours_0: any;
  hours_0_temp: any;
  hours_1: any;
  hours_1_temp: any;
  minute_0: any;
  minute_0_temp: any;
  minute_1: any;
  minute_1_temp: any;
  second_0: any;
  second_0_temp: any;
  second_1: any;
  second_1_temp: any;

  private unsubscribe: Subject<any>;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.pleaseWaitLoader = true;
    this.initSearchProductForm();
    this.api.getLandingPageFixMart().pipe(
      tap((data: any) => {
        this.kategoripilihan = data.kategori_pilihan;
        this.palingPopuler = data.paling_populer;
        this.palingTerlaris = data.paling_banyak_dicari;
        this.produk = data.produk;
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.pleaseWaitLoader = false;
        this.cdr.markForCheck();
      })
    ).subscribe();

    setInterval(() => {
      const currentDate = moment(new Date());
      var tomorrowDateMoment = moment(new Date()).add(1, 'days').format('YYYY-MM-DD 00:00:00');
      const tomorrowDate = moment(tomorrowDateMoment);

      const diff = tomorrowDate.diff(currentDate);

      const diffDuration = moment.duration(diff);

      if (diffDuration.hours() < 10) {
        this.hours_0_temp = 0;
        this.hours_1_temp = diffDuration.hours();
      } else {
        this.hours_0_temp = diffDuration.hours().toString()[0];
        this.hours_1_temp = diffDuration.hours().toString()[1];
      }

      if (diffDuration.minutes() < 10) {
        this.minute_0_temp = 0;
        this.minute_1_temp = diffDuration.minutes();
      } else {
        this.minute_0_temp = diffDuration.minutes().toString()[0];
        this.minute_1_temp = diffDuration.minutes().toString()[1];
      }

      if (diffDuration.seconds() < 10) {
        this.second_0_temp = 0;
        this.second_1_temp = diffDuration.seconds();
      } else {
        this.second_0_temp = diffDuration.seconds().toString()[0];
        this.second_1_temp = diffDuration.seconds().toString()[1];
      }

      this.hours_0 = this.hours_0_temp;
      this.hours_1 = this.hours_1_temp;
      this.minute_0 = this.minute_0_temp;
      this.minute_1 = this.minute_1_temp;
      this.second_0 = this.second_0_temp;
      this.second_1 = this.second_1_temp;
    }, 1000);

  }

  initSearchProductForm() {
    this.searchProductForm = this.fb.group({
      keyword_search: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  searchProduct() {
    const controls = this.searchProductForm.controls;
    if (this.searchProductForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.searchProductFormInvalid = true;
      return;
    }

    const authData = {
      keyword_search: controls['keyword_search'].value,
    };

    this.router.navigate(['/search-fixmarket'], {
      queryParams:
        {
          product: authData.keyword_search
        },
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.searchProductForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
