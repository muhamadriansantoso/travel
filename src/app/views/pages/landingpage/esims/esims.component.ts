import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APIService} from "../../../../core/API";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-esims',
  templateUrl: './esims.component.html',
  styleUrls: ['./esims.component.scss']
})
export class EsimsComponent implements OnInit {
  eSIMsData: any;
  type: string;
  sessionID: string;
  pleaseWaitLoader: boolean;
  countryList: any;
  modalRef: BsModalRef;
  supplierData: any;
  searchCountryForm: FormGroup;
  countryChoosen: string;
  countryChoosenValue: string;
  countryLoading: boolean;
  notFound: boolean;

  private unsubscribe: Subject<any>;

  constructor(
    private http: HttpClient,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private router: Router,
    private _sanitizer: DomSanitizer,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.pleaseWaitLoader = true;
    this.type = 'local';
    this.initSearchCountryForm();
    this.api.getEsimsSupplier().toPromise().then((data: any) => {
      this.supplierData = data;
      this.getAPIFromSupplier(data.length);
    });
  }

  initSearchCountryForm() {
    this.searchCountryForm = this.fb.group({
      country: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  async getAPIFromSupplier(length) {
    if (this.type == 'local') {
      this.pleaseWaitLoader = false;
      this.eSIMsData = [];
      // for (var abc = 0; abc < length; abc++) {
      //   await this.api.geteSIMs(this.type, this.supplierData[abc].id, this.eSIMsData)
      //     .toPromise().then((data: any) => {
      //       if (data.data.status == 1) {
      //         this.sessionID = data.sessionID;
      //         this.eSIMsData = data.data.data;
      //       }
      //     });
      // }
      // this.pleaseWaitLoader = false;
      // this.cdr.markForCheck();
    } else if (this.type == 'global') {
      this.eSIMsData = [];
      for (var abc = 0; abc < length; abc++) {
        await this.api.geteSIMs(this.type, this.supplierData[abc].id, this.eSIMsData, '')
          .toPromise().then((data: any) => {
            if (data.data.status == 1) {
              this.sessionID = data.sessionID;
              this.eSIMsData = data.data.data;
              this.notFound = false;
            } else {
              this.notFound = true;
            }
          });
      }
      this.pleaseWaitLoader = false;
      this.cdr.markForCheck();
    }
  }

  beforeChange($event: NgbTabChangeEvent) {
    this.type = $event.nextId;
    this.eSIMsData = '';
    this.pleaseWaitLoader = true;
    this.getAPIFromSupplier(this.supplierData.length);
  };

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  countryCountValue(value) {
    if (value.length > 2) {
      this.countryLoading = true;
      this.api.getCountry(value).pipe(
        tap((data: any) => {
          this.countryList = data;
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.countryLoading = false;
          this.cdr.markForCheck();
        })
      ).subscribe();
    } else {
      this.countryList = [];
    }
  }

  hitAPIeSIMLocal(id, country) {
    this.pleaseWaitLoader = true;
    this.countryList = [];
    this.countryChoosen = country;
    this.api.geteSIMs('local', '3', this.eSIMsData, id).pipe(
      tap((data: any) => {
        if (data.data.status == 1) {
          this.sessionID = data.sessionID;
          this.eSIMsData = data.data.data;
          this.notFound = false;
        } else {
          this.notFound = true;
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.pleaseWaitLoader = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.searchCountryForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  navigateToBooking(data) {
    this.modalRef.hide();
    this.api.EsimsBookingInsertDB(this.sessionID, JSON.stringify(data))
      .pipe(
        tap((data: any) => {
          this.router.navigate(['esims-booking', data.sessionID]);
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  esimsErrorPopUp() {
    this.notFound = false;
  }

}
