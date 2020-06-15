import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {APIService} from "../../../../core/API";
import {Router} from "@angular/router";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  produk: any;
  searchProductForm: FormGroup;
  searchProductFormInvalid: boolean;

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
        this.produk = data.produk;
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.pleaseWaitLoader = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
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
