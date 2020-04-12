import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APIService} from "../../../../core/API";
import {FormBuilder} from "@angular/forms";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from "@angular/router";

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
  modalRef: BsModalRef;
  supplierData: any;

  private unsubscribe: Subject<any>;

  constructor(
    private http: HttpClient,
    private api: APIService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private router: Router,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.pleaseWaitLoader = true;
    this.type = 'local';

    this.api.getEsimsSupplier().toPromise().then((data: any) => {
      this.supplierData = data;
      this.getAPIFromSupplier(data.length);
    });
  }

  async getAPIFromSupplier(length) {
    if (this.type == 'local') {
      this.eSIMsData = [];
      for (var abc = 0; abc < length; abc++) {
        await this.api.geteSIMs(this.type, this.supplierData[abc].id, this.eSIMsData)
          .toPromise().then((data: any) => {
            if (data.data.status == 1) {
              this.sessionID = data.sessionID;
              this.eSIMsData = data.data.data;
            }
          });
      }
      this.pleaseWaitLoader = false;
      this.cdr.markForCheck();
    } else if (this.type == 'global') {
      this.eSIMsData = [];
      for (var abc = 0; abc < length; abc++) {
        await this.api.geteSIMs(this.type, this.supplierData[abc].id, this.eSIMsData)
          .toPromise().then((data: any) => {
            if (data.data.status == 1) {
              this.sessionID = data.sessionID;
              this.eSIMsData = data.data.data;
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

  navigateToBooking(data) {
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

}
