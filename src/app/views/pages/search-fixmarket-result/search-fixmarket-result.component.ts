import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from "../../../core/API";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {finalize, takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-search-fixmarket-result',
  templateUrl: './search-fixmarket-result.component.html',
  styleUrls: ['./search-fixmarket-result.component.scss']
})
export class SearchFixmarketResultComponent implements OnInit {
  product: any;
  productData: any;
  searchTitle: any;
  pleaseWaitLoader: boolean;

  private unsubscribe: Subject<any>;

  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.pleaseWaitLoader = true;
    this.route.queryParams.subscribe(params => {
      this.product = params.product;

      this.api.getProductFixMart(this.product).pipe(
        tap((data: any) => {
          this.searchTitle = data.title;
          this.productData = data.produk;
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.pleaseWaitLoader = false;
          this.cdr.markForCheck();
        })
      ).subscribe();
    });
  }

}
