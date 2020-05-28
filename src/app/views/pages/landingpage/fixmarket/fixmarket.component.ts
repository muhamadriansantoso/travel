import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {APIService} from "../../../../core/API";
import {Router} from "@angular/router";

@Component({
  selector: 'app-fixmarket',
  templateUrl: './fixmarket.component.html',
  styleUrls: ['./fixmarket.component.scss']
})
export class FixmarketComponent implements OnInit {
  customOptions: OwlOptions = {
    items: 8,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    loop: true,
    navSpeed: 500,
    autoplay: true,
    nav: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
  };

  kategoripilihan: any;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.api.getLandingPageFixMart().subscribe((data: any) => {
      this.kategoripilihan = data.kategori_pilihan;
      this.cdr.detectChanges();
    });
  }
}
