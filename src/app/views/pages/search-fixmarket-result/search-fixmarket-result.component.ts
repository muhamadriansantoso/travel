import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {APIService} from "../../../core/API";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";

@Component({
  selector: 'app-search-fixmarket-result',
  templateUrl: './search-fixmarket-result.component.html',
  styleUrls: ['./search-fixmarket-result.component.scss']
})
export class SearchFixmarketResultComponent implements OnInit {
  product: any;
  productData: any;

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
    this.route.queryParams.subscribe(params => {
      this.product = params.product;

      this.api.getProductFixMart(this.product).subscribe((data: any) => {
        this.productData = data.produk;
        this.cdr.detectChanges();
      });
    });
  }

}
